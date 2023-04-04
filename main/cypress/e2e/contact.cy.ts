describe("contact", () => {
  beforeEach("go to contact page", () => {
    cy.visit("/contact");
  });

  it("should submit contact form", () => {
    cy.fillContactForm();

    cy.intercept("POST", "/api/support/email", { statusCode: 200 }).as(
      "sendContactForm"
    );

    cy.get("form").submit();
    cy.wait("@sendContactForm").its("request.body").should("deep.equal", {
      firstname: "Louise",
      lastname: "Martin",
      email: "louise.martin@mail.fr",
      profile: "profile-tenant",
      subject: "Demande de support",
      message: "Bonjour",
    });

    cy.get(".mail-success-container").should("be.visible");
  });

  it("should display error when form can't be sent", () => {
    cy.fillContactForm();

    cy.intercept("POST", "/api/support/email", { statusCode: 500 }).as(
      "sendContactForm"
    );

    cy.get("form").submit();
    cy.wait("@sendContactForm");

    cy.get("#submit-error-modal").should("be.visible");
    cy.get("#submit-error-modal").find("button").click().as("close modal");
    cy.get("#submit-error-modal").should("not.exist");
  });

  const errorMessagesShould = (expectation: string) => {
    cy.get("form").find(".fr-input-group--error").should(expectation);
    cy.get("form").find(".fr-input--error").should(expectation);
  };

  it("should not submit when fields are missing", () => {
    errorMessagesShould("not.exist");
    cy.get("form").submit();
    errorMessagesShould("be.visible");
  });
});
