import { getTenantUser, UserType } from "../../support/users";

describe("decline tenant scenario", () => {
  const user = getTenantUser();
  const refusalMessage =
    "[test-e2e] wrong identification";

  it("declined tenant can re-submit", () => {
    cy.loginWithFCAndDeleteAccount(
      user.username,
      user.password,
      UserType.TENANT,
    );

    cy.tenantLoginWithFC(user.username, user.password);
    cy.rejectCookies();

    cy.contains("Pour vous").click();
    cy.verifyTenantIdentity(user.firstname, user.lastname);
    cy.clickOnNext();

    cy.expectPath("/type-locataire");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Autre");

    cy.expectPath("/documents-locataire/2");
    cy.contains("Autres situations").click();
    cy.contains("En situation précaire").click();
    cy.contains("Vous êtes dans une situation précaire").click();
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/3");
    cy.selectProfessionalStatusStep("CDI");

    cy.expectPath("/documents-locataire/4");
    cy.contains("Déclarer ses ressources").click();
    cy.contains("Pas de revenus").click();
    cy.clickOnNext();
    cy.expectPath("/documents-locataire/4");
    cy.clickOnNext();

    cy.expectPath("/documents-locataire/5");
    cy.contains("Vous avez un avis d’impôt").click();
    cy.simpleUploadDocumentStep("un avis d’impôt français");

    cy.expectPath("/choix-garant");
    cy.contains("Vous n'avez pas de garant").click();
    cy.clickOnNext();

    cy.validationStep();
    cy.contains("Votre dossier est actuellement en cours de traitement").should(
      "be.visible",
    );

    // Operator declines only the identity document with a refusal message
    cy.declineAloneFile(Cypress.env("aloneTenantEmail"), refusalMessage, [
      "IDENTIFICATION",
    ]);

    // Dashboard surfaces the amendment-required card after a refusal
    cy.visit(Cypress.env("tenantUrl") + "/account");
    cy.contains("Modifications demandées").should("be.visible");
    cy.contains("Consulter ma messagerie").click();
    cy.expectPath("/messaging");
    
    // Tenant reads the refusal on the messaging page
    cy.contains("Modification demandée").should("be.visible");
    cy.contains(refusalMessage).should("be.visible");

    cy.contains("Mettre à jour").click();
    cy.expectPath("/documents-locataire/1");
    cy.simpleUploadDocumentStep("Autre");

    // Resubmit: honor declaration is pre-checked from the first submission
    cy.visit(Cypress.env("tenantUrl") + "/validation-dossier");
    cy.validationStep();
    cy.contains("Votre dossier est actuellement en cours de traitement").should(
      "be.visible",
    );
  });
});
