import { expect, Locator, Page } from '@playwright/test';

/**
 * Clase base del Page Object Model.
 * Centraliza la navegación y los elementos comunes a todas las páginas.
 */
export abstract class BasePage {
  protected readonly page: Page;
  readonly titulo: Locator;

  /** Ruta relativa a BASE_URL, p. ej. "/inventory.html". */
  protected abstract readonly ruta: string;

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByTestId('title');
  }

  async abrir(): Promise<void> {
    await this.page.goto(this.ruta);
  }

  /** Verifica que el navegador esté en esta página (URL + título). */
  async verificarQueEstaCargada(tituloEsperado: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.ruta.replace('.', '\\.')}$`));
    await expect(this.titulo).toHaveText(tituloEsperado);
  }
}
