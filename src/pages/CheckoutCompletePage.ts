import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Confirmación de la orden: /checkout-complete.html */
export class CheckoutCompletePage extends BasePage {
  protected readonly ruta = '/checkout-complete.html';

  readonly encabezado: Locator;
  readonly texto: Locator;
  readonly botonVolver: Locator;

  constructor(page: Page) {
    super(page);
    this.encabezado = page.getByTestId('complete-header');
    this.texto = page.getByTestId('complete-text');
    this.botonVolver = page.getByTestId('back-to-products');
  }

  async verificarQueEstaCargada(): Promise<void> {
    await super.verificarQueEstaCargada('Checkout: Complete!');
  }

  async volverAProductos(): Promise<void> {
    await this.botonVolver.click();
  }
}
