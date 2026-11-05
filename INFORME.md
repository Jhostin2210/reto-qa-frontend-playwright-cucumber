# Informe · Estrategia de automatización (Frontend, Playwright + Cucumber)

## 1. Alcance y enfoque

Se automatiza la historia *"Como cliente de Sauce Demo quiero iniciar sesión, agregar productos al carrito y completar una compra"*. Hay un feature por cada área funcional (login, carrito, compra) y cada uno contiene escenarios positivos y negativos. Los escenarios usan los dos tipos de usuario que pide el reto: `standard_user` y `locked_out_user`.

Los escenarios están en **Gherkin en español** (`# language: es`) para que el negocio pueda leerlos. Describen el **comportamiento** ("agrega el producto X al carrito") y no la interacción técnica ("hace clic en el botón #add-to-cart").

| Criterio | Escenarios |
|---|---|
| Login válido | 1 positivo |
| Login inválido | `locked_out_user`, 5 combinaciones de credenciales inválidas y acceso sin sesión |
| Agregar al carrito | 1 producto, varios productos y seguir comprando |
| Ver el carrito | Nombres y precios iguales a los del catálogo, y eliminar un producto |
| Completar la compra | E2E hasta la confirmación, totales correctos, campos obligatorios y cancelar |

## 2. Arquitectura y patrones

```
Feature (Gherkin) → Step Definitions → Page Objects → Playwright → Navegador
                          ↑
                 World (estado por escenario) ← Hooks (ciclo de vida)
```

| Patrón | Implementación | Beneficio |
|---|---|---|
| **Page Object Model** | `src/pages/*Page.ts` heredan de `BasePage` | Los selectores y las acciones de cada página están en una sola clase. Si cambia la UI, se corrige en un solo lugar y los steps no se tocan. |
| **Component Object** | `HeaderComponent` | La cabecera (carrito y contador) aparece en varias páginas y se modela una sola vez. |
| **Herencia (Template)** | `BasePage.abrir()` y `verificarQueEstaCargada()` | Navegación y verificación de carga uniformes: cada página solo declara su `ruta` y su título. |
| **World de Cucumber (inyección de contexto)** | `support/world.ts` | Cada escenario recibe un World nuevo con su `page`, sus page objects y su estado (`productosAgregados`). Así se comparte información entre steps sin variables globales. |
| **Hooks** | `support/hooks.ts` | Hay un navegador por proceso y un **contexto aislado por escenario** (cookies y carrito limpios). Si un escenario falla, se adjunta una captura al reporte. |
| **Datos de prueba separados** | `src/data/` | Las credenciales y los datos de envío no están escritos en los steps, y la contraseña se puede tomar de una variable de entorno. |
| **Data-driven** | `Esquema del escenario` + `Ejemplos`, y `DataTable` | Más combinaciones con menos código, por ejemplo 5 casos de login inválido en un solo esquema. |
| **Configuración externa** | `support/config.ts` + variables de entorno | Navegador, modo headless, URL y slowMo se cambian sin tocar código. |

## 3. Decisiones técnicas

- **Selectores `data-test`**: `selectors.setTestIdAttribute('data-test')` permite usar `getByTestId(...)`. Son estables y no dependen de clases CSS ni de textos. Los productos se ubican por **nombre exacto** dentro de su tarjeta, así que no dependen de IDs internos.
- **Esperas automáticas**: se usan las aserciones *web-first* de Playwright (`expect(locator).toHaveText`) y `expect.poll`. No hay `sleep` en ninguna parte.
- **Validaciones de negocio y no solo de UI**: el precio en el carrito coincide con el del catálogo, el subtotal es la suma de los precios y el total es el subtotal más los impuestos (redondeados a 2 decimales).
- **Independencia**: cada escenario inicia sesión en su propio contexto. Se pueden ejecutar en cualquier orden y en **paralelo** (`npm run test:parallel`).
- **TypeScript** con `strict`: errores de tipado detectados antes de ejecutar (`npm run typecheck`).
- **Multinavegador**: Chromium por defecto, y Firefox o WebKit con `BROWSER=...`.

## 4. Reportes y CI

- Reportes HTML, JSON y JUnit en `reports/`, con capturas adjuntas cuando algo falla.
- El pipeline de GitHub Actions (`.github/workflows/e2e.yml`) instala las dependencias y el navegador, ejecuta la suite y publica los reportes como artefacto.

## 5. Posibles mejoras

- Agregar los demás usuarios de Sauce Demo (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) para cubrir defectos conocidos.
- Pruebas visuales con `toHaveScreenshot` y pruebas de accesibilidad con axe-core.
- Iniciar sesión por cookie/`storageState` en las precondiciones para acelerar la suite.
