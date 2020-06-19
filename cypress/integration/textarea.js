/**
  Helper function for a repeating of commands

  e.g : cy
        .get('.rta__textarea')
        .type(`${repeat('{backspace}', 13)} again {downarrow}{enter}`);
 */
function repeat(string, times = 1) {
  let result = "";
  let round = times;
  while (round--) {
    result += string;
  }

  return result;
}

describe("React Textarea Autocomplete", () => {
  it("server is reachable", () => {
    cy.visit("http://localhost:8080");
  });

  it("textarea exists", () => {
    cy.get(".rta__textarea");
  });

  it("focus textarea by innerRef", () => {
    cy.focused().should("not.be.visible");
    cy.get('[data-test="focus"]').click();
    cy.focused().should("be.visible");
  });

  context("basic", () => {
    beforeEach(() => {
      cy.get(".rta__textarea").clear({ force: true });
      cy.get('[data-test="minChar"]').clear({ force: true });
    });

    it("minChar works correctly basned on the lenght of the trigger char", () => {
      cy.get('[data-test="minChar"]').type("{uparrow}"); // set minChar to 1

      cy.get(".rta__textarea").type("This is test ::");
      cy.get(".rta__autocomplete").should("not.be.visible");

      cy.get(".rta__textarea").type("This is test ::a");
      cy.get(".rta__autocomplete").should("be.visible");

      cy.get(".rta__textarea").type("This is test :");
      cy.get(".rta__autocomplete").should("not.be.visible");

      cy.get(".rta__textarea").type("This is test :a");
      cy.get(".rta__autocomplete").should("be.visible");
    });

    it("basic test with keyboard", () => {
      cy.get(".rta__textarea")
        .type("This is test :ro{downarrow}{enter}")
        .should("have.value", "This is test 🙄");
    });

    it("basic keyboard test after unmounting second instance", () => {
      cy.get('[data-test="showSecondTextarea"]').click();
      cy.get('[data-test="showSecondTextarea"]').click();
      cy.get(".rta__textarea")
        .type("This is test :ro{downarrow}{enter}")
        .should("have.value", "This is test 🙄");
    });

    it("should change only correct part of the word", () => {
      cy.get(".rta__textarea")
        .type("This is test:ro{downarrow}{enter}")
        .should("have.value", "This is test🙄");
    });

    it("special character like [, ( should be also possible to use as trigger char", () => {
      cy.get(".rta__textarea")
        .type("This is test [{enter}")
        .should("have.value", "This is test @");
    });

    it("basic test with mouse", () => {
      cy.get(".rta__textarea")
        .type("This is test :ro")
        .get("li:nth-child(2)")
        .click();

      cy.get(".rta__textarea").should("have.value", "This is test 🙄");
    });

    it("do not move as you type", () => {
      let startLeft = null;

      cy.get(".rta__textarea")
        .type("This is test :r")
        .then(() => {
          startLeft = Cypress.$(".rta__autocomplete").css("left");
        })
        .type("ofl", { force: true })
        .then(() => {
          const endLeft = Cypress.$(".rta__autocomplete").css("left");
          cy.get(".rta__autocomplete").should("to.have.css", {
            left: startLeft
          });

          expect(startLeft).to.be.equal(endLeft);
        });
    });

    it("do move as you type", () => {
      cy.get('[data-test="movePopupAsYouType"]').click();

      let startLeft = null;

      cy.get(".rta__textarea")
        .type("This is test :r")
        .then(() => {
          startLeft = Cypress.$(".rta__autocomplete").css("left");
        })
        .type("ofl", { force: true })
        .then(() => {
          const endLeft = Cypress.$(".rta__autocomplete").css("left");
          cy.get(".rta__autocomplete").should("to.have.css", { left: endLeft });

          expect(startLeft).to.not.be.equal(endLeft);
        });

      cy.get('[data-test="movePopupAsYouType"]').click();
    });
  });

  context("advanced", () => {
    beforeEach(() => {
      cy.get(".rta__textarea").clear({ force: true });
      cy.get('[data-test="minChar"]').clear({ force: true });
    });

    it("onItemHighlighted should return correct item and trigger", () => {
      cy.get(".rta__textarea").type(":ro{uparrow}{uparrow}");
      cy.window().then(async win => {
        const shouldSelectItem = {
          currentTrigger: ":",
          item: { name: "rofl", char: "🤣" }
        };

        expect(win.__lastHighlightedItem).to.deep.equal(shouldSelectItem);
      });
    });

    it("onItemSelected should return correct item and trigger", () => {
      cy.get(".rta__textarea").type(":ro{uparrow}{uparrow}{enter}");
      cy.window().then(async win => {
        const shouldSelectItem = {
          currentTrigger: ":",
          item: { name: "rofl", char: "🤣" }
        };

        expect(win.__lastSelectedItem).to.deep.equal(shouldSelectItem);
      });
    });

    it("should have place caret before outputted word", () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
       */
      cy.get('[data-test="caretStart"]').click();

      cy.get(".rta__textarea").type("This is test :ro{downarrow}{downarrow}");

      cy.get(".rta__item:nth-child(3)").click();

      cy.get('[data-test="actualCaretPosition"]').contains("13");
    });

    it("should place caret after word", () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
       */
      cy.get('[data-test="caretEnd"]').click();

      cy.get(".rta__textarea").type("This is test :ro{downarrow}{downarrow}");

      cy.get(".rta__item:nth-child(3)").click();

      cy.get('[data-test="actualCaretPosition"]').contains("18"); // emoji is 2 bytes
    });

    it("should caret after word with a space", () => {
      /**
       * This is probably Cypress bug (1.0.2)
       * This test needs to be run in headed mode, otherwise fails
       */
      cy.get('[data-test="caretNext"]').click();

      cy.get(".rta__textarea").type("This is test :ro{downarrow}{downarrow}");

      cy.get(".rta__item:nth-child(3)").click();

      cy.get('[data-test="actualCaretPosition"]').contains("19"); // emoji is 2 bytes
    });

    it("set caret position", () => {
      cy.get('[data-test="caretEnd"]').click();
      cy.get(".rta__textarea").type("This is test :ro{uparrow}{enter}");
      cy.get('[data-test="setCaretPosition"]').click();
      cy.get('[data-test="actualCaretPosition"]').contains("1");
    });

    it("get caret position", () => {
      cy.get('[data-test="caretEnd"]').click();
      const stub = cy.stub();

      cy.on("window:alert", stub);

      cy.get(".rta__textarea").type("This is test :ro{uparrow}{enter}");
      cy.get('[data-test="getCaretPosition"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(15);
        });
    });

    it("get currently selected word", () => {
      cy.get(".rta__textarea").type(`test{selectall}`);

      const stub = cy.stub();

      cy.on("window:alert", stub);

      cy.get('[data-test="getSelectedText"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith("test");
        });

      cy.get('[data-test="getSelectionPosition"]')
        .click()
        .then(() => {
          expect(stub.getCall(1)).to.be.calledWith(
            '{"selectionStart":0,"selectionEnd":4}'
          );
        });
    });

    it("should close the textarea when click outside happens", () => {
      cy.get(".rta__textarea").type("This is test :ro{uparrow}{uparrow}");

      cy.get(".rta__autocomplete").should("be.visible");

      cy.get('[data-test="dummy"]').click();

      cy.get(".rta__autocomplete").should("not.be.visible");
    });

    it('slow request should be "cancelled" when user keep typing', () => {
      cy.get(".rta__textarea").type("This is test @jaku not really");

      cy.get(".rta__autocomplete").should("not.be.visible");
    });

    it("should allows tokens with eventual whitespace", () => {
      cy.get(".rta__textarea").type("This is test [another charact");
      cy.get('[data-test="actualToken"]').contains("another charact");
      cy.get(".rta__textarea").type("{esc} and", { force: true });
      cy.get(".rta__textarea").type(
        `${repeat("{backspace}", 13)} again {downarrow}{enter}`,
        {
          force: true
        }
      );
      cy.get(".rta__textarea").should("have.value", "This is test /");
    });

    it("show autocomplete only after whitespace", () => {
      cy.get(".rta__textarea").type("This is test;");
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("This is test;a");
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type(";");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("something ;");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("something ;somethingmore");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get('[data-test="minChar"]').type("{uparrow}");

      cy.get(".rta__textarea").type("This is test;");
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("This is test;a");
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type(";a");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("something ;a");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });

      cy.get(".rta__textarea").type("something ;somethingmore");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__textarea").clear({ force: true });
    });

    it("test multi-character triggers and its possible combo", () => {
      cy.get(".rta__textarea").type("This is test /");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__textarea").should("have.value", "This is test fred");
    });

    // https://github.com/webscopeio/react-textarea-autocomplete/issues/145
    it("test multi-character triggers overlapping another trigger", () => {
      cy.get(".rta__textarea").type("This is test ::something");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__textarea").should("have.value", "This is test test2");
    });

    it("change value from outside should trigger the autocomplete as well", () => {
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get('[data-test="changeValueTo"]').click();
      cy.get(".rta__autocomplete").should("be.visible");
    });

    it("should stay within boundaries", () => {
      cy.get(".rta__autocomplete").should("not.be.visible");
      cy.get(".rta__textarea").type("This is test :a");
      cy.get(".rta__autocomplete").should(
        "have.class",
        "rta__autocomplete--bottom"
      );
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__textarea").type(`${repeat("\n", 5)} test :a`, {
        force: true
      });
      cy.get(".rta__autocomplete").should(
        "have.class",
        "rta__autocomplete--top"
      );
    });

    it("another example of advanced combo usage", () => {
      cy.get(".rta__textarea").type("This is test ({enter}");
      cy.get(".rta__textarea").type(".");
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__textarea").should("have.value", "This is test (country.ID");
    });

    it("once its selected dont show the autocomplete anymore", () => {
      cy.get(".rta__textarea").type("This is test (");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__list")
        .get("li:nth-child(1)")
        .click();
      cy.get(".rta__textarea").should("have.value", "This is test (country");
      cy.get(".rta__textarea").type("somethingelse");
      cy.get(".rta__autocomplete").should("not.be.visible");
    });

    it("event is successfully blocked", () => {
      cy.window().then(async win => {
        const spy = cy.spy(win.console, "log");

        await cy
          .get(".rta__textarea")
          .type(":ro{uparrow}{uparrow}{enter}")
          .then(e => {
            // the last console.log call should not be `pressed "enter"` because that event is blocked because it's happening in autocomplete.
            expect(spy.lastCall.args).to.eql([`pressed "o"`]);
          });
      });
    });

    it("should be possible return null and do nothing", () => {
      cy.get(".rta__textarea").type("This is test (");
      cy.get(".rta__autocomplete").should("be.visible");
      cy.get(".rta__list")
        .get("li:nth-child(3)")
        .click();
      cy.get(".rta__textarea").should("have.value", "This is test (");
    });

    it("arrow down and up should not stop autocomplete when dropdown is open", () => {
      cy.get(".rta__textarea").type("This is test :cro{downarrow}w{enter}");
      cy.get(".rta__textarea").should("have.value", "This is test 👑");
    });
  });
});
