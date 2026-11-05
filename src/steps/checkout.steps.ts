import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { clienteValido } from '../data/clientes';
import { CustomWorld } from '../support/world';
import { redondear } from '../utils/precio';

When('procede al checkout', async function (this: CustomWorld) {
  await this.cartPage.irAlCheckout();
  await this.checkoutInformationPage.verificarQueEstaCargada();
});

When(
  'completa sus datos de envío con nombre {string}, apellido {string} y código postal {string}',
  async function (this: CustomWorld, nombre: string, apellido: string, codigoPostal: string) {
    await this.checkoutInformationPage.completarDatos({ nombre, apellido, codigoPostal });
  }
);

When('completa sus datos de envío con datos válidos', async function (this: CustomWorld) {
  await this.checkoutInformationPage.completarDatos(clienteValido);
});

When('finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.verificarQueEstaCargada();
  await this.checkoutOverviewPage.finalizarCompra();
});

When('cancela el checkout', async function (this: CustomWorld) {
  await this.checkoutInformationPage.cancelar();
});

Then('debería ver la confirmación de la orden {string}', async function (this: CustomWorld, mensaje: string) {
  await this.checkoutCompletePage.verificarQueEstaCargada();
  await expect(this.checkoutCompletePage.encabezado).toHaveText(mensaje);
});

Then('el formulario de checkout debería mostrar el error {string}', async function (this: CustomWorld, mensaje: string) {
  await expect(this.checkoutInformationPage.mensajeError).toHaveText(mensaje);
  await expect(this.page).toHaveURL(/checkout-step-one\.html/);
});

Then('el resumen de la orden debería listar los productos agregados', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.verificarQueEstaCargada();
  const enResumen = await this.checkoutOverviewPage.obtenerProductos();
  const ordenar = (lista: { nombre: string }[]) => [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
  expect(ordenar(enResumen)).toEqual(ordenar(this.productosAgregados));
});

Then('el subtotal debería ser la suma de los precios de los productos', async function (this: CustomWorld) {
  const { subtotal } = await this.checkoutOverviewPage.obtenerMontos();
  const sumaEsperada = redondear(this.productosAgregados.reduce((suma, p) => suma + p.precio, 0));
  expect(subtotal).toBe(sumaEsperada);
});

Then('el total debería ser el subtotal más los impuestos', async function (this: CustomWorld) {
  const { subtotal, impuestos, total } = await this.checkoutOverviewPage.obtenerMontos();
  expect(impuestos).toBeGreaterThan(0);
  expect(total).toBe(redondear(subtotal + impuestos));
});
