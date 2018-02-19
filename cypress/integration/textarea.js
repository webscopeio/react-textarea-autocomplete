describe('React Textarea Autocomplete', () => {
  it('server is reachable', () => {
    cy.visit('http://localhost:8080');
  });

  it('textarea exists', () => {
    cy.get('.rta__textarea');
  });

  context('basic', () => {
    beforeEach(() => {
      cy.get('.rta__textarea').clear();
    });

    it('basic test with keyboard', () => {
      cy
        .get('.rta__textarea')
        .type('This is test :ro{downarrow}{enter}')
        .should('have.value', 'This is test 🤣');
    });

    it('should change only correct part of the word', () => {
      cy
        .get('.rta__textarea')
        .type('This is test:ro{downarrow}{enter}')
        .should('have.value', 'This is test🤣');
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

  context('advanced', () => {
    beforeEach(() => {
      cy.get('.rta__textarea').clear();
    });

    it('should have place caret before outputed word', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be runned in headed mode, otherwise fails
       */
      cy.get('[id="caretStart"]').click();

      cy.get('.rta__textarea').type('This is test :ro{downarrow}{downarrow}');

      cy.get('.rta__item:nth-child(3)').click();

      cy.get('[data-test="actualCaretPosition"]').contains('13');
    });

    it('should have place caret after word', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be runned in headed mode, otherwise fails
       */
      cy.get('[id="caretEnd"]').click();

      cy.get('.rta__textarea').type('This is test :ro{downarrow}{downarrow}');

      cy.get('.rta__item:nth-child(3)').click();

      cy.get('[data-test="actualCaretPosition"]').contains('15'); // emoji is 2 bytes
    });

    it('should have place caret after word with a space', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be runned in headed mode, otherwise fails
       */
      cy.get('[id="caretNext"]').click();

      cy.get('.rta__textarea').type('This is test :ro{downarrow}{downarrow}');

      cy.get('.rta__item:nth-child(3)').click();

      cy.get('[data-test="actualCaretPosition"]').contains('16'); // emoji is 2 bytes
    });

    it('set caret position', () => {
      cy.get('[id="caretEnd"]').click();
      cy.get('.rta__textarea').type('This is test :ro{uparrow}{enter}');
      cy.get('[data-test="setCaretPosition"]').click();
      cy.get('[data-test="actualCaretPosition"]').contains('1');
    });

    it('get caret position', () => {
      cy.get('[id="caretEnd"]').click();
      const stub = cy.stub();

      cy.on('window:alert', stub);

      cy.get('.rta__textarea').type('This is test :ro{uparrow}{enter}');
      cy
        .get('[data-test="getCaretPosition"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(15);
        });
    });

    it('should close the textarea when click outside happens', () => {
      cy.get('[data-test="clickoutsideOption"]').click();

      cy.get('.rta__textarea').type('This is test :ro{uparrow}{uparrow}');

      cy.get('.rta__autocomplete').should('be.visible');

      cy.get('[data-test="clickoutsideOption"]').click();

      cy.get('.rta__autocomplete').should('not.be.visible');
    });

    it('should be possible to select item with click with closeOnClickOutside option enabled', () => {
      cy.get('[data-test="clickoutsideOption"]').click();

      cy
        .get('.rta__textarea')
        .type('This is test :ro')
        .get('li:nth-child(2)')
        .click();

      cy.get('.rta__textarea').should('have.value', 'This is test 🤣');

      cy.get('.rta__autocomplete').should('not.be.visible');
    });

    it('slow request should be "cancelled" when user keep typing', () => {
      cy.get('.rta__textarea').type('This is test @jaku not really');

      cy.get('.rta__autocomplete').should('not.be.visible');
    });
  });
});
