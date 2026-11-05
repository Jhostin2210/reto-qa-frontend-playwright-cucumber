/**
 * Configuración de Cucumber.
 * - Features en Gherkin (español) dentro de src/features
 * - Step definitions y soporte (World, hooks) en TypeScript, cargados con ts-node
 * - Reportes en la carpeta reports/
 */
module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    format: [
      'progress-bar',
      'summary',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-report.xml'
    ],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
