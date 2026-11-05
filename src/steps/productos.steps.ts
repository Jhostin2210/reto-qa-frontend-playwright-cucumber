import { DataTable, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

async function agregarProducto(world: CustomWorld, nombre: string): Promise<void> {
  const producto = await world.inventoryPage.obtenerProducto(nombre);
  await world.inventoryPage.agregarAlCarrito(nombre);
  world.productosAgregados.push(producto);
}

When('agrega el producto {string} al carrito', async function (this: CustomWorld, nombre: string) {
  await agregarProducto(this, nombre);
});

When('agrega los siguientes productos al carrito:', async function (this: CustomWorld, tabla: DataTable) {
  for (const fila of tabla.hashes()) {
    await agregarProducto(this, fila.producto);
  }
});

When('vuelve a la página de productos', async function (this: CustomWorld) {
  await this.cartPage.seguirComprando();
  await this.inventoryPage.verificarQueEstaCargada();
});

Then(
  'el botón del producto {string} debería decir {string}',
  async function (this: CustomWorld, nombre: string, textoBoton: string) {
    await expect(this.inventoryPage.botonDe(nombre)).toHaveText(textoBoton);
  }
);

Then('el ícono del carrito debería mostrar {int} producto(s)', async function (this: CustomWorld, cantidad: number) {
  await expect(this.header.contadorCarrito).toHaveText(String(cantidad));
});
