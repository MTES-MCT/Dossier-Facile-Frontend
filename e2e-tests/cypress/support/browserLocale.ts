export function forceFrenchLocale(
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions,
): void {
  if (browser.family === "chromium" && browser.name !== "electron") {
    launchOptions.preferences.default.intl = { accept_languages: "fr-FR,fr" };
    launchOptions.args.push("--lang=fr");
  }
}
