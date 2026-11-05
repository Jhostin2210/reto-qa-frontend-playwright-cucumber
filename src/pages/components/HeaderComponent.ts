import { Locator, Page } from '@playwright/test';

/** Componente de cabecera presente en todas las páginas tras iniciar sesión. */
export class HeaderComponent {
  readonly enlaceCarrito: Locator;
  readonly contadorCarrito: Locator;

  constructor(page: Page) {
    this.enlaceCarrito = page.getByTestId('shopping-cart-link');
    this.contadorCarrito = page.getByTestId('shopping-cart-badge');
  }

  async abrirCarrito(): Promise<void> {
    await this.enlaceCarrito.click();
  }
}
