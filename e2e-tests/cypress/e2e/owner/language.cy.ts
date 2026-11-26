// The suite runs with a French browser: an English page can only come from the language the app passes.
function visitHomeWithLanguage(lang: "fr" | "en") {
  cy.visit(Cypress.env("ownerUrl") + "/home", {
    onBeforeLoad: (win) => {
      win.document.cookie = `lang=${lang}; path=/`;
    },
  });
}

describe("language passed to the owner login page", () => {
  it("shows the login page in English when the owner app is in English", () => {
    visitHomeWithLanguage("en");
    cy.get('input[name="username"]').should("be.visible");
    cy.location("search").should("include", "ui_locales=en");
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("lets the login page follow the browser when the owner app is in French", () => {
    visitHomeWithLanguage("fr");
    cy.get('input[name="username"]').should("be.visible");
    cy.location("search").should("not.include", "ui_locales");
    cy.get("html").should("have.attr", "lang", "fr");
  });
});
