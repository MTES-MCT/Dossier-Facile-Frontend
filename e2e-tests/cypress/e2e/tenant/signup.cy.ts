describe("signup page", () => {
  const email = "signup@yopmail.fr";
  const goodPassword = "SecureP4ssw0rd!";
  const weakPassword = "123";

  beforeEach("visit signup page", () => {
    cy.visit(`${Cypress.env("tenantUrl")}/signup`);
    cy.acceptCookies();
  });

  it("should warn about weak password", () => {
    cy.get("#password").type(weakPassword);

    cy.get(".fr-error-text").should("be.visible");
  });

  it("should warn if passwords are not equal", () => {
    cy.get("#password").type(goodPassword);
    cy.get("#confirm-password").type(weakPassword);

    cy.get(".fr-error-text").should("be.visible");
  });

  it("should fill signup form", () => {
    cy.intercept("POST", "/api/register/account", { statusCode: 200 }).as(
      "createAccount"
    );

    cy.get("#email").type(email);
    cy.get("#password").type(goodPassword);
    cy.get("#confirm-password").type(goodPassword);

    cy.iframe('iframe[title="reCAPTCHA"]')
      .find("#recaptcha-anchor")
      .click();

    cy.get('label[for="acceptCgu"]').click();

    cy.get("#signupForm").submit();

    cy.wait("@createAccount");

    cy.get(".modal").should("be.visible");
    cy.contains("Un mail vous a été envoyé à l'adresse indiquée.").should(
      "be.visible"
    );
  });
});
