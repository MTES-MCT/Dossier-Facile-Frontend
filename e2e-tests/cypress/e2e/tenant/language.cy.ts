// The suite runs with a French browser: an English page can only come from the language the app passes.
function visitWithLanguage(url: string, lang: "fr" | "en") {
  cy.visit(url, {
    onBeforeLoad: (win) => win.localStorage.setItem("lang", lang),
  });
}

describe("language passed to the tenant login page and to the main site's sign-up links", () => {
  it("shows the login page in English when the tenant app is in English", () => {
    visitWithLanguage(Cypress.env("tenantUrl") + "/login", "en");
    cy.get('input[name="username"]').should("be.visible");
    cy.location("search").should("include", "ui_locales=en");
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("lets the login page follow the browser when the tenant app is in French", () => {
    visitWithLanguage(Cypress.env("tenantUrl") + "/login", "fr");
    cy.get('input[name="username"]').should("be.visible");
    cy.location("search").should("not.include", "ui_locales");
    cy.get("html").should("have.attr", "lang", "fr");
  });

  // The pages of the main site that have a sign-up button or link.
  for (const page of ["/", "/partenaires", "/blog/locatio-devient-dossier-facile", "/plan-du-site"]) {
    it(`gives every sign-up link of the main site's ${page} page the site's language`, () => {
      visitWithLanguage(Cypress.env("mainUrl") + page, "en");
      cy.get('a[href*="/registrations"]').should(($links) => {
        expect($links).to.have.length.greaterThan(0);
        $links.each((_, link) => expect(link.getAttribute("href")).to.include("ui_locales=en"));
      });

      // A first visit: the site starts in French and stores it once it runs.
      cy.clearLocalStorage();
      cy.visit(Cypress.env("mainUrl") + page);
      cy.window().its("localStorage.lang").should("equal", "fr");
      cy.get('a[href*="/registrations"]').should(($links) => {
        expect($links).to.have.length.greaterThan(0);
        $links.each((_, link) => expect(link.getAttribute("href")).not.to.include("ui_locales"));
      });
    });
  }
});
