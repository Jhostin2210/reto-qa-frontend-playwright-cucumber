import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('abre el carrito de compras', async function (this: CustomWorld) {
  await this.header.abrirCarrito();
  await this.cartPage.verificarQueEstaCargada();
});

When('elimina el producto {string} del carrito', async function (this: CustomWorld, nombre: string) {
  await this.cartPage.eliminar(nombre);
  this.productosAgregados = this.productosAgregados.filter((p) => p.nombre !== nombre);
});

Then('debería estar en el carrito de compras', async function (this: CustomWorld) {
  await this.cartPage.verificarQueEstaCargada();
});

Then('el carrito debería contener exactamente los productos agregados', async function (this: CustomWorld) {
  const esperados = this.productosAgregados.map((p) => p.nombre).sort();
  await expect.poll(async () => (await this.cartPage.obtenerNombres()).sort()).toEqual(esperados);
});

Then(
  'cada producto del carrito debería tener el mismo precio que en el catálogo',
  async function (this: CustomWorld) {
    const enCarrito = await this.cartPage.obtenerProductos();
    for (const esperado of this.productosAgregados) {
      const encontrado = enCarrito.find((p) => p.nombre === esperado.nombre);
      expect(encontrado, `"${esperado.nombre}" debería estar en el carrito`).toBeDefined();
      expect(encontrado!.precio).toBe(esperado.precio);
    }
  }
);

Then('el carrito debería quedar vacío', async function (this: CustomWorld) {
  await expect(this.header.contadorCarrito).toHaveCount(0);
});
