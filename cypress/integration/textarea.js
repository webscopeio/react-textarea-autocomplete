/**
  Helper function for a repeating of commands

  e.g : cy
        .get('.rta__textarea')
        .type(`${repeat('{backspace}', 13)} again {downarrow}{enter}`);
 */
function repeat(string, times = 1) {
  let result = '';
  let round = times;
  while (round--) {
    result += string;
  }

  return result;
}

describe('React Textarea Autocomplete', () => {
  it('server is reachable', () => {
    cy.visit('http://localhost:8080');
  });

  it('textarea exists', () => {
    cy.get('.rta__textarea');
  });

  context('basic', () => {
    beforeEach(() => {
      cy.get('.rta__textarea').clear({ force: true });
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

    it('special character like [, ( should be also possible to use as trigger char', () => {
      cy
        .get('.rta__textarea')
        .type('This is test [{enter}')
        .should('have.value', 'This is test @');
    });

    it('basic test with mouse', () => {
      cy
        .get('.rta__textarea')
        .type('This is test :ro')
        .get('li:nth-child(2)')
        .click();

      cy.get('.rta__textarea').should('have.value', 'This is test 🤣');
    });

    it('do not move as you type', () => {
      let startLeft = null;

      cy
        .get('.rta__textarea')
        .type('This is test :r')
        .then(() => {
          startLeft = Cypress.$('.rta__autocomplete').css('left');
        })
        .type('ofl', { force: true })
        .then(() => {
          const endLeft = Cypress.$('.rta__autocomplete').css('left');
          cy
            .get('.rta__autocomplete')
            .should('to.have.css', { left: startLeft });

          expect(startLeft).to.be.equal(endLeft);
        });
    });

    it('do move as you type', () => {
      cy.get('[data-test="movePopupAsYouType"]').click();

      let startLeft = null;

      cy
        .get('.rta__textarea')
        .type('This is test :r')
        .then(() => {
          startLeft = Cypress.$('.rta__autocomplete').css('left');
        })
        .type('ofl', { force: true })
        .then(() => {
          const endLeft = Cypress.$('.rta__autocomplete').css('left');
          cy.get('.rta__autocomplete').should('to.have.css', { left: endLeft });

          expect(startLeft).to.not.be.equal(endLeft);
        });

      cy.get('[data-test="movePopupAsYouType"]').click();
    });
  });

  context('advanced', () => {
    beforeEach(() => {
      cy.get('.rta__textarea').clear({ force: true });
    });

    it('should have place caret before outputted word', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
       */
      cy.get('[id="caretStart"]').click();

      cy.get('.rta__textarea').type('This is test :ro{downarrow}{downarrow}');

      cy.get('.rta__item:nth-child(3)').click();

      cy.get('[data-test="actualCaretPosition"]').contains('13');
    });

    it('should place caret after word', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
       */
      cy.get('[id="caretEnd"]').click();

      cy.get('.rta__textarea').type('This is test :ro{downarrow}{downarrow}');

      cy.get('.rta__item:nth-child(3)').click();

      cy.get('[data-test="actualCaretPosition"]').contains('15'); // emoji is 2 bytes
    });

    it('should caret after word with a space', () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
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

    it('should allows tokens with eventual whitespace', () => {
      cy.get('.rta__textarea').type('This is test [another charact');
      cy.get('[data-test="actualToken"]').contains('another charact');
      cy.get('.rta__textarea').type('{esc} and', { force: true });
      cy
        .get('.rta__textarea')
        .type(`${repeat('{backspace}', 13)} again {downarrow}{enter}`, {
          force: true,
        });
      cy.get('.rta__textarea').should('have.value', 'This is test /');
    });
  });
});
