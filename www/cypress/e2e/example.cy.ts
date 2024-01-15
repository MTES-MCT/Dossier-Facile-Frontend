// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Montez un dossier de location en béton pour trouver le logement de vos rêves')
  })
})
