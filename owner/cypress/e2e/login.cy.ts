import { CYCLIC_KEY } from '@storybook/addon-actions';

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.get('#username').type('matthieub+proprio@dossierfacile.fr');
    cy.get('#password').type('toto123;');
    cy.get('#kc-login').click();
  });
});
