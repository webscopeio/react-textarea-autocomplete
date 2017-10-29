describe('React Textarea Autocomplete', () => {
  it('server is reachable', () => {
    cy.visit('http://localhost:8080');
  });

  it('textarea exists', () => {
    cy.get('.rta__textarea');
  });

  context('textarea', () => {
    beforeEach(() => {
      cy.get('.rta__textarea').clear();
    });

    it('basic test with keyboard', () => {
      cy
        .get('.rta__textarea')
        .type('This is test :ro{downarrow}{enter}')
        .should('have.value', 'This is test 🤣');
    });

    it('basic test with mouse', () => {
      cy
        .get('.rta__textarea')
        .type('This is test :ro')
        .get('li:nth-child(2)')
        .click();

      cy.get('.rta__textarea').should('have.value', 'This is test 🤣');
    });
  });
});
