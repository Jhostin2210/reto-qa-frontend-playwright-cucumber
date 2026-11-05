import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, selectors, webkit } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { CustomWorld } from './world';

setDefaultTimeout(config.stepTimeoutMs);

const launchers = { chromium, firefox, webkit };
let browser: Browser;

BeforeAll(async function () {
  // Sauce Demo identifica sus elementos con el atributo data-test
  selectors.setTestIdAttribute('data-test');
  browser = await launchers[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo
  });
});

Before(async function (this: CustomWorld) {
  // Contexto aislado por escenario: cookies, localStorage y carrito limpios
  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: config.viewport
  });
  const page = await this.context.newPage();
  page.setDefaultTimeout(config.actionTimeoutMs);
  this.initPages(page);
});

After(async function (this: CustomWorld, { result, pickle }) {
  if (result?.status === Status.FAILED && this.page) {
    const carpeta = path.join('reports', 'screenshots');
    fs.mkdirSync(carpeta, { recursive: true });
    const nombre = pickle.name.replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 100);
    const imagen = await this.page.screenshot({ path: path.join(carpeta, `${nombre}.png`), fullPage: true });
    this.attach(imagen, 'image/png');
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
