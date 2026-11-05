export type BrowserName = 'chromium' | 'firefox' | 'webkit';

/**
 * Configuración centralizada. Todo se puede sobrescribir con variables de entorno:
 *   BASE_URL, BROWSER (chromium|firefox|webkit), HEADLESS (true|false), SLOW_MO (ms)
 */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  browser: (process.env.BROWSER ?? 'chromium') as BrowserName,
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? 0),
  viewport: { width: 1366, height: 768 },
  stepTimeoutMs: 60_000,
  actionTimeoutMs: 15_000
};
