import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { obtenerUsuario } from '../data/usuarios';
import { CustomWorld } from '../support/world';

Given('que el usuario está en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.abrir();
  await this.loginPage.verificarQueEstaVisible();
});

Given('que el usuario inició sesión como {string}', async function (this: CustomWorld, tipoUsuario: string) {
  await this.loginPage.abrir();
  await this.loginPage.iniciarSesionCon(obtenerUsuario(tipoUsuario));
  await this.inventoryPage.verificarQueEstaCargada();
});

When('inicia sesión como {string}', async function (this: CustomWorld, tipoUsuario: string) {
  await this.loginPage.iniciarSesionCon(obtenerUsuario(tipoUsuario));
});

When(
  'ingresa el usuario {string} y la contraseña {string}',
  async function (this: CustomWorld, usuario: string, password: string) {
    await this.loginPage.iniciarSesion(usuario, password);
  }
);

When('intenta abrir directamente la página de productos', async function (this: CustomWorld) {
  await this.inventoryPage.abrir();
});

Then('debería ver la página de productos', async function (this: CustomWorld) {
  await this.inventoryPage.verificarQueEstaCargada();
});

Then('el catálogo debería mostrar {int} productos', async function (this: CustomWorld, cantidad: number) {
  await expect(this.inventoryPage.productos).toHaveCount(cantidad);
});

Then('debería ver el mensaje de error {string}', async function (this: CustomWorld, mensaje: string) {
  await expect(this.loginPage.mensajeError).toBeVisible();
  await expect(this.loginPage.mensajeError).toHaveText(mensaje);
});

Then('debería permanecer en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.verificarQueEstaVisible();
  await expect(this.page).not.toHaveURL(/inventory\.html/);
});
