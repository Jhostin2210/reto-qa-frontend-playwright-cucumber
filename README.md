# Reto QA Frontend · Sauce Demo con Playwright + Cucumber

Suite de pruebas E2E para [Sauce Demo](https://www.saucedemo.com/). Usa **Playwright** para controlar el navegador, **Cucumber** con escenarios en Gherkin (en español) y **TypeScript**. El diseño sigue el patrón **Page Object Model**.

| Criterio de aceptación | Feature |
|---|---|
| Iniciar sesión con credenciales válidas | `login.feature` |
| No iniciar sesión con credenciales inválidas (incluye `locked_out_user`) | `login.feature` |
| Agregar un producto al carrito desde la página de productos | `carrito.feature` |
| Ver los productos agregados en el carrito | `carrito.feature` |
| Completar la compra hasta la confirmación | `compra.feature` |

**Cobertura:** 18 escenarios y 133 pasos, positivos y negativos, con `standard_user` y `locked_out_user`.

---

## 1. Requisitos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Node.js | **22 LTS o superior** | `node -v` |
| npm | Viene con Node | `npm -v` |
| Internet | Acceso a `saucedemo.com` y al registro de npm | — |

## 2. Instalación (solo la primera vez)

Desde la carpeta del proyecto:

```bash
npm install                 # instala dependencias (usa package-lock.json)
npx playwright install chromium   # descarga el navegador que usa Playwright
```

> Para probar también en Firefox o WebKit: `npx playwright install`.
> En Linux puede hacer falta instalar las dependencias del sistema: `npx playwright install --with-deps chromium`.

## 3. Ejecutar las pruebas

| Qué | Comando |
|---|---|
| Toda la suite (headless) | `npm test` |
| Viendo el navegador (lento, para demo) | `npm run test:headed` |
| Solo pruebas de humo | `npm run test:smoke` |
| Solo login / carrito / compra | `npm run test:login` · `npm run test:carrito` · `npm run test:compra` |
| Solo casos negativos | `npm run test:negativos` |
| En paralelo (3 workers) | `npm run test:parallel` |
| En Firefox / WebKit | `npm run test:firefox` · `npm run test:webkit` |
| Por tag arbitrario | `npx cucumber-js --tags "@compra and @negativo"` |
| Un solo feature | `npx cucumber-js src/features/login.feature` |
| Verificar tipos TypeScript | `npm run typecheck` |

### Variables de entorno

| Variable | Default | Uso |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | URL de la aplicación |
| `BROWSER` | `chromium` | `chromium`, `firefox` o `webkit` |
| `HEADLESS` | `true` | `false` para ver el navegador |
| `SLOW_MO` | `0` | Milisegundos de pausa entre acciones |
| `SAUCE_PASSWORD` | `secret_sauce` | Contraseña de los usuarios de prueba |

Ejemplo en PowerShell: `$env:HEADLESS="false"; npm test`

## 4. Reportes

Se generan en `reports/`:

- `cucumber-report.html`: reporte HTML con cada escenario y sus pasos. Si un escenario falla, incluye la captura de pantalla.
- `cucumber-report.json` y `cucumber-report.xml`: para CI (JSON de Cucumber y JUnit).
- `screenshots/`: capturas de los escenarios fallidos.

## 5. Estructura del proyecto

```
frontend-playwright-cucumber/
├── package.json            # Dependencias y scripts npm
├── cucumber.js             # Configuración de Cucumber (rutas, ts-node, reportes)
├── tsconfig.json
├── README.md
├── INFORME.md              # Estrategia de automatización y patrones
└── src/
    ├── features/           # Escenarios en Gherkin (español)
    │   ├── login.feature
    │   ├── carrito.feature
    │   └── compra.feature
    ├── steps/              # Step definitions: traducen Gherkin a acciones sobre los Page Objects
    │   ├── login.steps.ts
    │   ├── productos.steps.ts
    │   ├── carrito.steps.ts
    │   └── checkout.steps.ts
    ├── pages/              # Page Object Model
    │   ├── BasePage.ts
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   ├── CheckoutInformationPage.ts
    │   ├── CheckoutOverviewPage.ts
    │   ├── CheckoutCompletePage.ts
    │   └── components/HeaderComponent.ts
    ├── support/            # Infraestructura
    │   ├── config.ts       # Configuración y variables de entorno
    │   ├── world.ts        # World de Cucumber: page objects y estado por escenario
    │   └── hooks.ts        # Abrir/cerrar navegador y screenshot en fallos
    ├── data/               # Datos de prueba
    │   ├── usuarios.ts     # standard_user, locked_out_user
    │   └── clientes.ts     # Datos de envío
    └── utils/
        └── precio.ts       # Parseo de precios y utilidades
```

## 6. Escenarios automatizados

**login.feature** (8)
- ✅ Login exitoso con `standard_user`: ve "Products" con 6 productos.
- ❌ `locked_out_user` recibe "Sorry, this user has been locked out."
- ❌ Outline con 5 combinaciones inválidas: contraseña incorrecta, usuario inexistente, usuario vacío, contraseña vacía y ambos vacíos.
- ❌ Acceder a `/inventory.html` sin sesión.

**carrito.feature** (4)
- ✅ Agregar un producto: el contador muestra 1 y el botón cambia a "Remove".
- ✅ Agregar 3 productos (tabla de datos): el carrito muestra exactamente esos productos con el mismo precio del catálogo.
- ✅ Eliminar un producto desde el carrito.
- ✅ El carrito conserva los productos al seguir comprando.

**compra.feature** (6)
- ✅ Compra completa hasta "Thank you for your order!", y el carrito queda vacío.
- ✅ El resumen lista los productos, el subtotal es la suma de los precios y el total es el subtotal más los impuestos.
- ❌ Outline: checkout sin nombre, sin apellido o sin código postal.
- ✅ Cancelar el checkout regresa al carrito sin perder productos.

## 7. Solución de problemas

| Problema | Solución |
|---|---|
| `Executable doesn't exist ... chromium` | Falta descargar el navegador: `npx playwright install chromium` |
| `npm` no se reconoce | Instala Node.js 22 LTS y reabre la terminal |
| `npm.ps1 cannot be loaded because running scripts is disabled` | En PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, o usa CMD |
| Error de versión de Node (`engines`) | Actualiza a Node 22 o superior |
| Timeouts | Revisa la conexión a saucedemo.com. Puedes subir los tiempos en `src/support/config.ts` |
