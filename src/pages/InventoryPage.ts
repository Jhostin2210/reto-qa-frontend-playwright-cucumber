import { Locator, Page } from '@playwright/test';
import { parsePrecio, Producto, textoExacto } from '../utils/precio';
import { BasePage } from './BasePage';

/** Página de productos (catálogo): /inventory.html */
export class InventoryPage extends BasePage {
  protected readonly ruta = '/inventory.html';

  readonly productos: Locator;

  constructor(page: Page) {
    super(page);
    this.productos = page.getByTestId('inventory-item');
  }

  async verificarQueEstaCargada(): Promise<void> {
    await super.verificarQueEstaCargada('Products');
  }

  /** Tarjeta del producto cuyo nombre coincide exactamente. */
  private tarjeta(nombre: string): Locator {
    return this.productos.filter({
      has: this.page.getByTestId('inventory-item-name').filter({ hasText: textoExacto(nombre) })
    });
  }

  /** Botón "Add to cart" / "Remove" de la tarjeta (los enlaces también tienen role=button, por eso se usa la etiqueta). */
  botonDe(nombre: string): Locator {
    return this.tarjeta(nombre).locator('button');
  }

  async obtenerProducto(nombre: string): Promise<Producto> {
    const textoPrecio = await this.tarjeta(nombre).getByTestId('inventory-item-price').innerText();
    return { nombre, precio: parsePrecio(textoPrecio) };
  }

  async agregarAlCarrito(nombre: string): Promise<void> {
    await this.tarjeta(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }
}
