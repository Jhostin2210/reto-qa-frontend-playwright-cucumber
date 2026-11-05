import { expect, Locator, Page } from '@playwright/test';
import { Credenciales } from '../data/usuarios';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly ruta = '/';

  readonly campoUsuario: Locator;
  readonly campoPassword: Locator;
  readonly botonLogin: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    this.campoUsuario = page.getByTestId('username');
    this.campoPassword = page.getByTestId('password');
    this.botonLogin = page.getByTestId('login-button');
    this.mensajeError = page.getByTestId('error');
  }

  async iniciarSesion(usuario: string, password: string): Promise<void> {
    await this.campoUsuario.fill(usuario);
    await this.campoPassword.fill(password);
    await this.botonLogin.click();
  }

  async iniciarSesionCon(credenciales: Credenciales): Promise<void> {
    await this.iniciarSesion(credenciales.username, credenciales.password);
  }

  async verificarQueEstaVisible(): Promise<void> {
    await expect(this.campoUsuario).toBeVisible();
    await expect(this.campoPassword).toBeVisible();
    await expect(this.botonLogin).toBeVisible();
  }
}
