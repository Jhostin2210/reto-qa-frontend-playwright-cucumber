import { Locator, Page } from '@playwright/test';
import { DatosEnvio } from '../data/clientes';
import { BasePage } from './BasePage';

/** Paso 1 del checkout (datos del cliente): /checkout-step-one.html */
export class CheckoutInformationPage extends BasePage {
  protected readonly ruta = '/checkout-step-one.html';

  readonly campoNombre: Locator;
  readonly campoApellido: Locator;
  readonly campoCodigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly botonCancelar: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    this.campoNombre = page.getByTestId('firstName');
    this.campoApellido = page.getByTestId('lastName');
    this.campoCodigoPostal = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.botonCancelar = page.getByTestId('cancel');
    this.mensajeError = page.getByTestId('error');
  }

  async verificarQueEstaCargada(): Promise<void> {
    await super.verificarQueEstaCargada('Checkout: Your Information');
  }

  async completarDatos(datos: DatosEnvio): Promise<void> {
    await this.campoNombre.fill(datos.nombre);
    await this.campoApellido.fill(datos.apellido);
    await this.campoCodigoPostal.fill(datos.codigoPostal);
    await this.botonContinuar.click();
  }

  async cancelar(): Promise<void> {
    await this.botonCancelar.click();
  }
}
