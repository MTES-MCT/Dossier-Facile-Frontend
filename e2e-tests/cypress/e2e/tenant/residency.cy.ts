import { getTenantUser, UserType } from "../../support/users";

describe(
  "residency category",
  { testIsolation: false, baseUrl: Cypress.env("tenantUrl") },
  () => {
    before("reset account, login and setup", () => {
      cy.clearAllCookies();
      const username = getTenantUser().username;
      cy.deleteAccount(username, UserType.TENANT);

      cy.tenantLogin(username);

      createCotenant();
      createGuarantor();
    });

    beforeEach(() => {
      cy.clearAllLocalStorage();
    })

    it("add residency documents for tenant", () => {
      cy.visit("/documents-locataire/2");

      testResidencyStep();
    });

    it("add residency documents for guarantor", () => {
      cy.visit("/info-garant/0");
      clickOnMenuItem("Situation d'hébergement");

      testResidencyStep();
    });

    it("add residency documents for cotenant", () => {
      clickOnMenuItem("Les documents de mon conjoint");
      clickOnMenuItem("Situation d'hébergement");

      testResidencyStep();
    });

    function testResidencyStep() {
      // Should be able to continue without choosing a category
      cy.clickOnNext();
      goBackToResidency();

      // Should be able to add text
      selectResidencyCategory("Dans une autre situation");
      cy.get(".dropbox").should("not.exist");
      cy.clickOnNext().expectPath("/2");
      cy.get("#customText").type("Test text").clickOnNext();
      goBackToResidency();
      cy.get("#customText").should("have.value", "Test text");

      // Should be able to continue without uploading a file
      selectResidencyCategory("Locataire");
      cy.clickOnNext();
      goBackToResidency();

      // Should upload a file and continue
      selectResidencyCategory("Propriétaire");
      cy.uploadDocument(1).clickOnNext();
      goBackToResidency();

      // Should get warning for category needing at least 3 files
      changeResidencyCategory("Hébergé par une personne tierce");
      verifyThatThreeDocumentsAreMandatory();
      goBackToResidency();
    }

    function selectResidencyCategory(categoryLabel: string) {
      cy.get("#select").select(categoryLabel);
    }

    function changeResidencyCategory(categoryLabel: string) {
      selectResidencyCategory(categoryLabel);
      clickOnModalButton("Valider");
    }

    function verifyThatThreeDocumentsAreMandatory() {
      cy.uploadDocument(1).clickOnNext();
      clickOnModalButton("Passer à l'étape suivante");

      goBackToResidency();

      cy.uploadDocument(1).clickOnNext();
      clickOnModalButton("Ajouter de nouveaux documents");
      cy.uploadDocument(1).clickOnNext();
    }

    function clickOnModalButton(buttonLabel: string) {
      cy.get(".modal")
        .should("be.visible")
        .get("button")
        .contains(buttonLabel)
        .click({ force: true });
      cy.waitUntilLoaderIsGone();
    }

    function goBackToResidency() {
      cy.wait(200);
      cy.expectPath("/3");
      cy.contains("Retour").click();
      cy.wait(200);
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
      cy.get('input[name="firstName"]').type("Louise");
      cy.clickOnNext();
    }

    function clickOnMenuItem(label: string) {
      cy.get("#funnel-menu").contains(label).click();
      cy.wait(1000);
    }
  }
);
