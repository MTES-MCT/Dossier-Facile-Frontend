describe("menu", () => {
  beforeEach(() => {
    cy.mockStats();
  });

  it("should redirect to info page", () => {
    cy.visit("/");
    cy.get(".fr-nav__list > :nth-child(1) > .fr-nav__link").click();

    cy.expectLocationContaining("/information");
    cy.get(".fr-h1").should("contain", "La démarche DossierFacile");
  });

  it("should redirect to blog page", () => {
    cy.visit("/");
    cy.get(".fr-nav__list > :nth-child(2) > .fr-nav__link").click();

    cy.expectLocationContaining("/blog");
    cy.get("h1").should("contain", "DossierFacile en articles");
  });

  it("should visit blog post", () => {
    cy.visit("/blog");

    const postTitle = "Locatio devient DossierFacile";
    cy.get(`[title="${postTitle}"]`).click();
    cy.get(".fr-h1").should("contain", postTitle);
  });

  it("should redirect to contact page", () => {
    cy.visit("/");
    cy.get("#contact-us").click();

    cy.expectLocationContaining("/contact");
    cy.get("h1").should("contain", "Contactez notre support");
  });

  it("should toggle language", () => {
    cy.visit("/");
    cy.get("#signin-button").should("contain", "Se connecter");
    cy.get(".fr-translate").should("be.visible").click();
    cy.get(":nth-child(2) > .fr-translate__language").click();
    cy.get("#signin-button").should("contain", "Sign in");
  });
});
