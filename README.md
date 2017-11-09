<div align="center">
<h1>react-textarea-autocomplete 📝</h1>
Enhanced textarea to achieve autocomplete functionality.
<br><br>

[![MIT License][license-badge]][License]
[![PRs Welcome][prs-badge]][prs]
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
<hr>

</div>
<div align="center">
<img src="https://i.imgur.com/sE0n6es.gif" align="center" width="500">
<br>
</div>
<br>


This package provides React Component to achieve GitHub's like functionality in comments regarding the textarea autocomplete. It can be used for example for emoji autocomplete or for @mentions. The render function (for displaying text enhanced by this textarea) is beyond the scope of this package and it should be solved separately.

## Installation

This module is distributed via [npm][npm] and should be installed as one of your project's `dependencies`:

```
yarn add @webscopeio/react-textarea-autocomplete
```



> This package also depends on `react` and `prop-types`. Please make sure you have
> those installed as well.

## Props

*Note: Every other props than the mentioned below will be propagated to textarea itself*

| Props         | Default              |  Type           |  Description 
| :------------- | :-------------       | :-------------  |  ---------
| loadingComponent | *required*         | React Component | Gets `data` props which is already fetched (and displayed) suggestion 
| trigger | *required*         | Object (Trigger type) | Define triggers and their corresponding behavior
| minChar | *optional*       | Number (= 1) | Number of characters that user should type for trigger a suggestion
| style | *optional* | Style Object | Style's of textarea
| containerStyle | *optional* | Style Object | Style's of textarea's container

### Trigger type

```javascript 
{
    [triggerChar: string]: {
        ?output: (item: Object | string, trigger?: string) => string,
        dataProvider: (token: string) => Promise<Array<Object | string>> | Array<Object | string>,
        component: ReactClass<*>,
    },
}
```

- **dataProvider** is called after each keystroke to get data what the suggestion list should display (array or promise resolving array)
- **component** is the component for render the item in suggestion list. It has `selected` and `entity` props provided by React Textarea Autocomplete
- **output** (Optional for string based item. If the item is an object this method is *required*) This function defines text which will be placed into textarea after the user makes a selection.

    Default behavior for string based item is string: `<TRIGGER><ITEM><TRIGGER>`). This method should **always** return a unique string.

## [Example of usage](http://react-textarea-autocomplete.surge.sh/)
`create-react-app example && cd example && yarn add @jukben/emoji-search @webscopeio/react-textarea-autocomplete`

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
````

## Development

Run `yarn` to fetch dependencies.

Run `yarn lint` check [ESlint][eslint] check (`yarn lint:fix` for quick fix)

Run `yarn flow` for flow check

Run `yarn test` to run unit-tests powered by [Jest][jest]

### Dev playground (recommended) 

Run `yarn dev` and open http://localhost:8080 for the playground

Run `yarn cypress:open` for open [Cypress][cypress] for E2E testing
 
### Build and link 
 
Run `yarn build` and `yarn link` then in your project folder (*you have to use the same version of React e.g 15.6.1*) `yarn link react-textarea-autocomplete` to link together.

Your PR's are welcomed! ❤️


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/8135252?v=4" width="100px;"/><br /><sub><b>Jakub Beneš</b></sub>](https://jukben.cz)<br />[💻](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben "Code") [📖](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/3114719?v=4" width="100px;"/><br /><sub><b>Andrey Taktaev</b></sub>](https://github.com/JokerNN)<br />[💻](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=JokerNN "Code") | [<img src="https://avatars3.githubusercontent.com/u/9276511?v=4" width="100px;"/><br /><sub><b>Davidson Nascimento</b></sub>](https://github.com/davidsonsns)<br />[💻](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=davidsonsns "Code") |
| :---: | :---: | :---: |
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
