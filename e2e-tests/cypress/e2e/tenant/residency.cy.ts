import { getTenantUser, UserType } from "../../support/users";

function getInputByLabel(label: string) {
  return cy
    .contains(label)
    .invoke("attr", "for")
    .then((id) => cy.get("#" + id));
}

describe(
  "residency category",
  { testIsolation: false, baseUrl: Cypress.env("tenantUrl") },
  () => {
    before("reset account, login and setup", () => {
      cy.clearAllCookies();
      const user = getTenantUser();
      cy.deleteAccount(user.username, user.password, UserType.TENANT);

      cy.tenantLogin(user.username, user.password);
      cy.rejectCookies();
      cy.contains("Pour vous").click();

      createCotenant();
      createGuarantor();
    });

    beforeEach(() => {
      cy.clearAllLocalStorage();
    });

    it("add residency documents for tenant", () => {
      cy.visit("/documents-locataire/2");

      testResidencyStep();

      // Should get warning for category needing at least 3 files
      verifyThatThreeDocumentsAreMandatory();
      goBackToResidency();
    });

    it("add residency documents for guarantor", () => {
      cy.visit("/liste-garants");
      cy.get('button[title="Modifier"]').click();
      clickOnMenuItem("Situation d'hébergement");

      testGuarantorResidencyStep();
    });

    it("add residency documents for cotenant", () => {
      clickOnMenuItem("Les documents de mon conjoint");
      cy.expectPath("/documents-colocataire/");
      clickOnMenuItem("Situation d'hébergement");

      testCoResidencyStep();
    });

    function testResidencyStep() {
      cy.contains("Autres situations").click();
      cy.contains("En situation précaire").click();
      cy.get(".dropbox").should("not.exist");
      cy.contains("Valider votre situation d'hébergement").should(
        "be.disabled"
      );
      cy.contains("Vous êtes dans une situation précaire").click();
      cy.contains("Valider votre situation d'hébergement").should("be.enabled");
      cy.clickOnNext().expectPath("/3");
      cy.contains("Retour").click();
      getInputByLabel("Vous êtes dans une situation précaire").should(
        "be.checked"
      );
      cy.contains("Modifier").click({ force: true });
      cy.contains("Modifier votre situation").click();

      // Should not be able to continue without uploading a file
      cy.contains("Locataire").click();
      cy.contains(
        "Vous avez une attestation de bon paiement des loyers"
      ).click();
      cy.contains("Valider votre situation d'hébergement").should(
        "be.disabled"
      );
      cy.contains("Modifier").click({ force: true });

      // Should upload a file and continue
      cy.contains("Propriétaire").click();
      cy.uploadDocument(1).clickOnNext();
      goBackToResidency();
      cy.contains("Modifier").click({ force: true });
      cy.contains("Modifier votre situation").click();
    }

    function testGuarantorResidencyStep() {
      cy.contains("Autre").click();
      cy.get(".dropbox").should("exist");
      cy.contains("Vous ne pouvez pas fournir de document").click();
      cy.clickOnNext().expectPath("/2");
      cy.get("textarea[name=customText]").type("Test");
      cy.uploadDocument(1).clickOnNext().expectPath("/3");
      cy.contains("Retour").click();
      cy.contains("Modifier").click({ force: true });
      cy.contains("Modifier votre situation").click();

      // Should be able to continue without uploading a file
      cy.contains("Locataire").click();
      cy.clickOnNext();
      goBackToResidency();

      // Should upload a file and continue
      cy.contains("Propriétaire").click();
      cy.uploadDocument(1).clickOnNext();
      goBackToResidency();
      cy.contains("Modifier").click({ force: true });
      cy.contains("Modifier votre situation").click();
    }

    function testCoResidencyStep() {
      // Precarious situation: should not be able to continue without checking the box
      cy.contains("Autres situations").click();
      cy.contains("En situation précaire").click();
      cy.get(".dropbox").should("not.exist");
      cy.contains("Valider votre situation d'hébergement").should(
        "be.disabled"
      );
      cy.contains("Votre conjoint est dans une situation précaire").click();
      cy.contains("Valider votre situation d'hébergement").should("be.enabled");
      cy.clickOnNext();
      cy.url().should("match", /\/3$/);
      cy.contains("Retour").click();
      cy.expectPath("/2/other-residency");
      getInputByLabel("Votre conjoint est dans une situation précaire").should(
        "be.checked"
      );
      cy.contains("Modifier").click({ force: true });
      cy.contains("Modifier votre situation").click();

      // Should be able to go back
      cy.contains("Locataire").click();
      cy.contains("Modifier").click({ force: true });
      cy.expectPath("/2");

      // Should upload a file and continue
      cy.contains("Propriétaire").click();
      cy.uploadDocument(1).clickOnNext();
      goBackToResidency();
    }

    function verifyThatThreeDocumentsAreMandatory() {
      cy.selectResidencyStep(
        "Locataire",
        "Vous avez vos 3 dernières quittances de loyer"
      );
      clickOnModalButton("Passer à l'étape suivante");
      cy.contains("Retour").click();
      cy.uploadDocument(1).clickOnNext();
      clickOnModalButton("Ajouter de nouveaux documents");
      cy.uploadDocument(1).clickOnNext();
    }

    function clickOnModalButton(buttonLabel: string) {
      cy.get(".modal")
        .should("be.visible")
        .get("button")
        .contains(buttonLabel)
        .click();
      cy.waitUntilModalIsGone();
    }

    function goBackToResidency() {
      cy.expectPath("/3");
      cy.contains("Retour").click();
    }

    function createGuarantor() {
      cy.visit("/choix-garant");
      cy.contains("Une personne").click().clickOnNext();

      cy.get("#lastname").type("Dupont");
      cy.get("#firstname").type("Jean");
      cy.clickOnNext();
    }

    function createCotenant() {
      cy.visit("/type-locataire");
      cy.contains("En couple").click();
      cy.get('input[name="coTenantLastName"]').type("Martin");
      cy.get('input[name="coTenantFirstName"]').type("Louise");
      cy.clickOnNext();
    }

    function clickOnMenuItem(label: string) {
      cy.get("#funnel-menu").contains(label).click();
    }
  }
);
