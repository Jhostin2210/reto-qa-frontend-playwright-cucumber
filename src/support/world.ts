import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { HeaderComponent } from '../pages/components/HeaderComponent';
import { Producto } from '../utils/precio';

/**
 * World de Cucumber: un objeto nuevo por escenario.
 * Contiene el navegador del escenario, los Page Objects y el estado compartido entre steps.
 */
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;

  // Page Objects
  header!: HeaderComponent;
  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutInformationPage!: CheckoutInformationPage;
  checkoutOverviewPage!: CheckoutOverviewPage;
  checkoutCompletePage!: CheckoutCompletePage;

  // Estado del escenario: productos que el usuario agregó (nombre + precio de catálogo)
  productosAgregados: Producto[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(page: Page): void {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInformationPage = new CheckoutInformationPage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }
}

setWorldConstructor(CustomWorld);
