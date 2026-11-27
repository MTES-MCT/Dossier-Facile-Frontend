describe("shared navigation commands", () => {
  function visitMarkup(body: string) {
    cy.intercept("GET", "**/__support-commands", {
      headers: { "content-type": "text/html" },
      body: `<!doctype html><html><body>${body}</body></html>`,
    });
    cy.visit(`${Cypress.expose("tenantUrl")}/__support-commands`);
  }

  for (const disabledAttribute of ["disabled", 'aria-disabled="true"']) {
    it(`waits before clicking a button with ${disabledAttribute}`, () => {
      visitMarkup(`<button data-cy="next-btn" ${disabledAttribute}
        onclick="this.dataset.clickedWhileDisabled = String(this.disabled || this.getAttribute('aria-disabled') === 'true')">Next</button>`);
      cy.window().then((win) => {
        win.setTimeout(() => {
          const button = win.document.querySelector("button");
          button?.removeAttribute("disabled");
          button?.setAttribute("aria-disabled", "false");
        }, 300);
      });
      cy.clickOnNext();
      cy.get("button").should(
        "have.attr",
        "data-clicked-while-disabled",
        "false",
      );
    });
  }

  it("waits for the native DSFR dialog to close", () => {
    visitMarkup('<dialog open class="fr-modal--patched">Open dialog</dialog>');
    cy.window().then((win) => {
      win.setTimeout(() => win.document.querySelector("dialog")?.close(), 300);
    });
    cy.waitUntilModalIsGone();
    cy.document().then((doc) => {
      expect(doc.querySelector("dialog")?.open).to.eq(false);
    });
  });
});
