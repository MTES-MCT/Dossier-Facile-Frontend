import { terminalLog } from "../../../e2e-tests/cypress/support/accessibility";

const routesToTest = [
  "/",
  "/information",
  "/blog",
  "/contact",
  "/stats",
  "/plan-du-site",
  "/accessibilite",
];

beforeEach(() => {
  cy.mockStats();
});

describe("accessibility tests", () => {
  routesToTest.forEach((route) => {
    it(`${route} has no detectable accessibility violations on load`, () => {
      cy.visit(route);
      cy.injectAxe();
      cy.checkA11y(undefined, undefined, terminalLog);
    });
  });
});
