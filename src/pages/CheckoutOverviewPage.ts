import { Locator, Page } from '@playwright/test';
import { parsePrecio, Producto } from '../utils/precio';
import { BasePage } from './BasePage';

/** Paso 2 del checkout (resumen de la orden): /checkout-step-two.html */
export class CheckoutOverviewPage extends BasePage {
  protected readonly ruta = '/checkout-step-two.html';

  readonly items: Locator;
  readonly subtotal: Locator;
  readonly impuestos: Locator;
  readonly total: Locator;
  readonly botonFinalizar: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.subtotal = page.getByTestId('subtotal-label');
    this.impuestos = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.botonFinalizar = page.getByTestId('finish');
  }

  async verificarQueEstaCargada(): Promise<void> {
    await super.verificarQueEstaCargada('Checkout: Overview');
  }

  async obtenerProductos(): Promise<Producto[]> {
    const nombres = await this.items.getByTestId('inventory-item-name').allInnerTexts();
    const precios = await this.items.getByTestId('inventory-item-price').allInnerTexts();
    return nombres.map((nombre, i) => ({ nombre, precio: parsePrecio(precios[i]) }));
  }

  async obtenerMontos(): Promise<{ subtotal: number; impuestos: number; total: number }> {
    return {
      subtotal: parsePrecio(await this.subtotal.innerText()),
      impuestos: parsePrecio(await this.impuestos.innerText()),
      total: parsePrecio(await this.total.innerText())
    };
  }

  async finalizarCompra(): Promise<void> {
    await this.botonFinalizar.click();
  }
}
