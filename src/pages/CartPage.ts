import { Locator, Page } from '@playwright/test';
import { parsePrecio, Producto, textoExacto } from '../utils/precio';
import { BasePage } from './BasePage';

/** Página del carrito: /cart.html */
export class CartPage extends BasePage {
  protected readonly ruta = '/cart.html';

  readonly items: Locator;
  readonly botonCheckout: Locator;
  readonly botonSeguirComprando: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.botonCheckout = page.getByTestId('checkout');
    this.botonSeguirComprando = page.getByTestId('continue-shopping');
  }

  async verificarQueEstaCargada(): Promise<void> {
    await super.verificarQueEstaCargada('Your Cart');
  }

  /** Lista de productos del carrito con su precio. */
  async obtenerProductos(): Promise<Producto[]> {
    const nombres = await this.items.getByTestId('inventory-item-name').allInnerTexts();
    const precios = await this.items.getByTestId('inventory-item-price').allInnerTexts();
    return nombres.map((nombre, i) => ({ nombre, precio: parsePrecio(precios[i]) }));
  }

  async obtenerNombres(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allInnerTexts();
  }

  async eliminar(nombre: string): Promise<void> {
    await this.items
      .filter({ has: this.page.getByTestId('inventory-item-name').filter({ hasText: textoExacto(nombre) }) })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async irAlCheckout(): Promise<void> {
    await this.botonCheckout.click();
  }

  async seguirComprando(): Promise<void> {
    await this.botonSeguirComprando.click();
  }
}
