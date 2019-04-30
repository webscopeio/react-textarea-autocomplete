<div align="center">
<h1>react-textarea-autocomplete 📝</h1>
Enhanced textarea to achieve autocomplete functionality.
<br><br>

[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]](#Development)
[![All Contributors](https://img.shields.io/badge/all_contributors-21-orange.svg?style=flat-square)](#contributors)
[![npm](https://img.shields.io/npm/dw/@webscopeio/react-textarea-autocomplete.svg?style=flat-square)](https://www.npmjs.com/package/@webscopeio/react-textarea-autocomplete)

<hr>

</div>
<div align="center">
<img src="https://i.imgur.com/sE0n6es.gif" align="center" width="500">
<br>
</div>
<br>

This package provides React Component to achieve GitHub's like functionality in comments regarding the textarea autocomplete. It can be used for example for emoji autocomplete or for @mentions. The render function (for displaying text enhanced by this textarea) is beyond the scope of this package and it should be solved separately.

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                                                     | last 2 versions                                                                                                                                                                                           |

## Installation

This module is distributed via [npm][npm] and should be installed as one of your project's `dependencies`:

```
yarn add @webscopeio/react-textarea-autocomplete
```

or there is UMD build available. [Check out this pen as example](https://codepen.io/jukben/pen/bYZqvR).

> This package also depends on `react` and `prop-types`. Please make sure you have
> those installed as well.

## Props

> _☝️ Note: Every other props than the mentioned below will be propagated to the textarea itself_

| Props                  | Type                                                                  | Description                                                                                                                                                                      |
| :--------------------- | :-------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **trigger\***          | Object: Trigger type                                                  | Define triggers and their corresponding behavior                                                                                                                                 |
| **loadingComponent\*** | React Component                                                       | Gets `data` props which is already fetched (and displayed) suggestion                                                                                                            |
| innerRef               | Function: (HTMLTextAreaElement) => void)                              | Allows you to get React ref of the underlying textarea                                                                                                                           |
| scrollToItem           | boolean \| (container: HTMLDivElement, item: HTMLDivElement) => void) | Defaults to true. With default implementation it will scroll the dropdown every time when the item gets out of the view.                                                         |
| minChar                | Number                                                                | Number of characters that user should type for trigger a suggestion. Defaults to 1.                                                                                              |
| onCaretPositionChange  | Function: (number) => void                                            | Listener called every time the textarea's caret position is changed. The listener is called with one attribute - caret position denoted by an integer number.                    |
| movePopupAsYouType     | boolean                                                               | When it's true the textarea will move along with a caret as a user continues to type. Defaults to false.                                                                         |
| boundariesElement      | string \| HTMLElement                                                 | Element which should prevent autocomplete to overflow. Defaults to _body_.                                                                                                       |
| textAreaComponent      | React.Component \| {component: React.Component, ref: string}          | What component use for as textarea. Default is `textarea`. (You can combine this with [react-autosize-textarea](https://github.com/buildo/react-autosize-textarea) for instance) |
| renderToBody      | boolean | When set to `true` the autocomplete will be rendered at the end of the `<body>`. Default is `false`. |
| style                  | Style Object                                                          | Style's of textarea                                                                                                                                                              |
| listStyle              | Style Object                                                          | Styles of list's wrapper                                                                                                                                                         |
| itemStyle              | Style Object                                                          | Styles of item's wrapper                                                                                                                                                         |
| loaderStyle            | Style Object                                                          | Styles of loader's wrapper                                                                                                                                                       |
| containerStyle         | Style Object                                                          | Styles of textarea's container                                                                                                                                                   |
| dropdownStyle          | Style Object                                                          | Styles of dropdown's wrapper                                                                                                                                                     |
| className              | string                                                                | ClassNames of the textarea                                                                                                                                                       |
| containerClassName     | string                                                                | ClassNames of the textarea's container                                                                                                                                           |
| listClassName          | string                                                                | ClassNames of list's wrapper                                                                                                                                                     |
| itemClassName          | string                                                                | ClassNames of item's wrapper                                                                                                                                                     |
| loaderClassName        | string                                                                | ClassNames of loader's wrapper                                                                                                                                                   |
| dropdownClassName      | string                                                                | ClassNames of dropdown's wrapper                                                                                                                                                 |

\*_are mandatory_

## Methods

The methods below can be called on the React component's ref (see: [React Docs](https://reactjs.org/docs/refs-and-the-dom.html))

| Methods                                                                | Description                                                         |
| :--------------------------------------------------------------------- | :------------------------------------------------------------------ |
| getCaretPosition() : number                                            | Gets the current caret position in the textarea                     |
| setCaretPosition(position : number) : void                             | Sets the caret position to the integer value passed as the argument |
| getSelectionPosition(): {selectionStart: number, selectionEnd: number} | Returns selectionStart and selectionEnd of the textarea             |
| getSelectedText(): ?string                                             | Returns currently selected word                                     |

Example:

```javascript
import React, { Component } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";

class App extends Component {
  onCaretPositionChange = (position) => {
    console.log(`Caret position is equal to ${position}`);
  }

  resetCaretPosition = () => {
    this.rta.setCaretPosition(0);
  }

  printCurrentCaretPosition = () => {
    const caretPosition = this.rta.getCaretPosition();
    console.log(`Caret position is equal to ${caretPosition}`);
  }

  render() {
    return (
      <div className="app">
        <div className="controls">
            <button onClick={this.resetCaretPosition}>Reset caret position</button>
            <button onClick={this.printCurrentCaretPosition}>Print current caret position to the console</button>
        </div>
        <ReactTextareaAutocomplete
          className="my-textarea"
          loadingComponent={() => <span>Loading</span>}
          trigger={{ ... }}
          ref={(rta) => { this.rta = rta; } }
          onCaretPositionChange={this.onCaretPositionChange}
        />
      </div>
    );
  }
}

export default App;
```

### Trigger type

```javascript
{
    [triggerChar: string]: {|
      output?: (
        item: Object | string,
        trigger?: string
      ) =>
        | {|
            key?: ?string,
            text: string,
            caretPosition: "start" | "end" | "next" | number
          |}
        | string | null,
      dataProvider: (
        token: string
      ) => Promise<Array<Object | string>> | Array<Object | string>,
      allowWhitespace?: boolean,
      afterWhitespace?: boolean,
      component: ReactClass<*>
    |},
}
```

- **dataProvider** is called after each keystroke to get data what the suggestion list should display (array or promise resolving array)
- **component** is the component for render the item in suggestion list. It has `selected` and `entity` props provided by React Textarea Autocomplete
- **allowWhitespace** (Optional; defaults to false) Set this to true if you want to provide autocomplete for words (tokens) containing whitespace
- **afterWhitespace** (Optional; defaults to false) Show autocomplete only if it's preceded by whitespace. Cannot be combined with _allowWhitespace_
- **output** (Optional for string based item. If the item is an object this method is _required_) This function defines text which will be placed into textarea after the user makes a selection.

  You can also specify the behavior of caret if you return object `{text: "item", caretPosition: "start"}` the caret will be before the word once the user confirms his selection. Other possible value are "next", "end" and number, which is absolute number in contex of textarea (0 is equal position before the first char). Defaults to "next" which is space after the injected word.

  The default behavior for string based item is a string: `<TRIGGER><ITEM><TRIGGER>`). This method should **always** return a unique string, otherwise, you have to use object notation and specify your own `key` or return object from `dataProvider` with `key` property.

  In order to skip the text replace phase let's return `null`.

## [Example of usage](http://react-textarea-autocomplete.surge.sh/)

`create-react-app example && cd example && yarn add @jukben/emoji-search @webscopeio/react-textarea-autocomplete`

> There is also UMD build available, [check this CodePen for a proof](https://codepen.io/jukben/pen/bYZqvR).💪

### App.js

```javascript
import React, { Component } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import emoji from "@jukben/emoji-search";

import logo from "./logo.svg";
import "./App.css";
import "@webscopeio/react-textarea-autocomplete/style.css";

const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <ReactTextareaAutocomplete
          className="my-textarea"
          loadingComponent={Loading}
          style={{
            fontSize: "18px",
            lineHeight: "20px",
            padding: 5
          }}
          ref={rta => {
            this.rta = rta;
          }}
          innerRef={textarea => {
            this.textarea = textarea;
          }}
          containerStyle={{
            marginTop: 20,
            width: 400,
            height: 100,
            margin: "20px auto"
          }}
          minChar={0}
          trigger={{
            ":": {
              dataProvider: token => {
                return emoji(token)
                  .slice(0, 10)
                  .map(({ name, char }) => ({ name, char }));
              },
              component: Item,
              output: (item, trigger) => item.char
            }
          }}
        />
      </div>
    );
  }
}

export default App;
```

## Development

Run `yarn` to fetch dependencies.

Run `yarn lint` check [ESlint][eslint] check (`yarn lint:fix` for quick fix)

Run `yarn flow` for flow check

Run `yarn test` to run unit-tests powered by [Jest][jest]

### Dev playground (recommended)

Run `yarn dev` and open http://localhost:8080 for the playground

Run `yarn cypress:open` for open [Cypress][cypress] for E2E testing

### Build and link

Run `yarn build` and `yarn link` then in your project folder (_you have to use the same version of React e.g 15.6.1_) `yarn link react-textarea-autocomplete` to link together.

Your PR's are welcomed! ❤️

## Contributors

| Maintainer |
| :--------: |


| [<img src="https://avatars3.githubusercontent.com/u/8135252?v=4" width="100px;"/><br /><sub><b>Jakub Beneš</b></sub>](https://jukben.cz)

Currently, I'm the only maintainer of this project. All related work I'm doing for is in my free time. If you like what I'm doing consider buy me a ☕. I'd appreciated! ❤️

<a href="https://www.buymeacoffee.com/jukben" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

Also, I'd love to thank these wonderful people for their contribution ([emoji key](https://github.com/kentcdodds/all-contribution)). You rock! 💪

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://jukben.cz"><img src="https://avatars3.githubusercontent.com/u/8135252?v=4" width="100px;" alt="Jakub Beneš"/><br /><sub><b>Jakub Beneš</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben" title="Code">💻</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben" title="Documentation">📖</a> <a href="#design-jukben" title="Design">🎨</a> <a href="#ideas-jukben" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/JokerNN"><img src="https://avatars3.githubusercontent.com/u/3114719?v=4" width="100px;" alt="Andrey Taktaev"/><br /><sub><b>Andrey Taktaev</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=JokerNN" title="Code">💻</a></td><td align="center"><a href="https://github.com/marcinlichwala"><img src="https://avatars0.githubusercontent.com/u/10706203?v=4" width="100px;" alt="Marcin Lichwała"/><br /><sub><b>Marcin Lichwała</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=marcinlichwala" title="Code">💻</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=marcinlichwala" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/davidsonsns"><img src="https://avatars3.githubusercontent.com/u/9276511?v=4" width="100px;" alt="Davidson Nascimento"/><br /><sub><b>Davidson Nascimento</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=davidsonsns" title="Code">💻</a></td><td align="center"><a href="http://www.effectivediscussions.org/"><img src="https://avatars1.githubusercontent.com/u/7477359?v=4" width="100px;" alt="KajMagnus"/><br /><sub><b>KajMagnus</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Akajmagnus" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=kajmagnus" title="Code">💻</a></td><td align="center"><a href="https://twitter.com/janvorcak"><img src="https://avatars2.githubusercontent.com/u/1083817?v=4" width="100px;" alt="Ján Vorčák"/><br /><sub><b>Ján Vorčák</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Ajvorcak" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jvorcak" title="Code">💻</a></td><td align="center"><a href="https://github.com/Andarist"><img src="https://avatars2.githubusercontent.com/u/9800850?v=4" width="100px;" alt="Mateusz Burzyński"/><br /><sub><b>Mateusz Burzyński</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=Andarist" title="Code">💻</a> <a href="#platform-Andarist" title="Packaging/porting to new platform">📦</a></td></tr><tr><td align="center"><a href="https://github.com/debugpai2"><img src="https://avatars0.githubusercontent.com/u/35139777?v=4" width="100px;" alt="Deepak Pai"/><br /><sub><b>Deepak Pai</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Adebugpai2" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=debugpai2" title="Code">💻</a></td><td align="center"><a href="http://aleck.me"><img src="https://avatars0.githubusercontent.com/u/2336595?v=4" width="100px;" alt="Aleck Landgraf"/><br /><sub><b>Aleck Landgraf</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=alecklandgraf" title="Code">💻</a></td><td align="center"><a href="https://github.com/oklas"><img src="https://avatars3.githubusercontent.com/u/8123356?v=4" width="100px;" alt="Serguei Okladnikov"/><br /><sub><b>Serguei Okladnikov</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Aoklas" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=oklas" title="Code">💻</a></td><td align="center"><a href="https://github.com/michauzo"><img src="https://avatars1.githubusercontent.com/u/2987177?v=4" width="100px;" alt="Michal Zochowski"/><br /><sub><b>Michal Zochowski</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Amichauzo" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=michauzo" title="Code">💻</a></td><td align="center"><a href="https://github.com/isachivka"><img src="https://avatars2.githubusercontent.com/u/1263650?v=4" width="100px;" alt="Igor Sachivka"/><br /><sub><b>Igor Sachivka</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Aisachivka" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=isachivka" title="Code">💻</a></td><td align="center"><a href="https://github.com/superandrew213"><img src="https://avatars3.githubusercontent.com/u/13059204?v=4" width="100px;" alt="Andrew Shini"/><br /><sub><b>Andrew Shini</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Asuperandrew213" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=superandrew213" title="Code">💻</a></td><td align="center"><a href="https://paperboat.io"><img src="https://avatars3.githubusercontent.com/u/3250906?v=4" width="100px;" alt="Rikesh Ramlochund"/><br /><sub><b>Rikesh Ramlochund</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Arrikesh" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=rrikesh" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://github.com/diogeneshamilton"><img src="https://avatars1.githubusercontent.com/u/983876?v=4" width="100px;" alt="Matthew Hamilton"/><br /><sub><b>Matthew Hamilton</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Adiogeneshamilton" title="Bug reports">🐛</a></td><td align="center"><a href="https://github.com/O4epegb"><img src="https://avatars3.githubusercontent.com/u/12836237?v=4" width="100px;" alt="Danila"/><br /><sub><b>Danila</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3AO4epegb" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=O4epegb" title="Code">💻</a></td><td align="center"><a href="http://sites.google.com/site/sdistefano/"><img src="https://avatars3.githubusercontent.com/u/600021?v=4" width="100px;" alt="Silvio Di Stefano"/><br /><sub><b>Silvio Di Stefano</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=sdistefano" title="Code">💻</a></td><td align="center"><a href="https://github.com/JelteF"><img src="https://avatars2.githubusercontent.com/u/1162278?v=4" width="100px;" alt="Jelte Fennema"/><br /><sub><b>Jelte Fennema</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3AJelteF" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=JelteF" title="Code">💻</a></td><td align="center"><a href="http://andypearson.co"><img src="https://avatars0.githubusercontent.com/u/857?v=4" width="100px;" alt="Andy Pearson"/><br /><sub><b>Andy Pearson</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Aandypearson" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=andypearson" title="Code">💻</a></td><td align="center"><a href="https://github.com/kinke"><img src="https://avatars0.githubusercontent.com/u/1889215?v=4" width="100px;" alt="Martin Kinkelin"/><br /><sub><b>Martin Kinkelin</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3Akinke" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=kinke" title="Code">💻</a></td><td align="center"><a href="https://github.com/Psyphant"><img src="https://avatars0.githubusercontent.com/u/364954?v=4" width="100px;" alt="Christopher Tempel"/><br /><sub><b>Christopher Tempel</b></sub></a><br /><a href="https://github.com/webscopeio/react-textarea-autocomplete/issues?q=author%3APsyphant" title="Bug reports">🐛</a> <a href="https://github.com/webscopeio/react-textarea-autocomplete/commits?author=Psyphant" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

<img src="https://media.giphy.com/media/AuIvUrZpzBl04/giphy.gif" width="500">

MIT

[npm]: https://www.npmjs.com/
[eslint]: https://eslint.org/
[jest]: https://facebook.github.io/jest/
[cypress]: https://www.cypress.io/
[license-badge]: https://img.shields.io/npm/l/react-autocompletely.svg?style=flat-square
[license]: https://github.com/paypal/react-autocompletely/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
