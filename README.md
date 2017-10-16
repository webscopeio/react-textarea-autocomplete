<div align="center">
<h1>react-textarea-autocomplete 📝</h1>
Enhanced textarea to achieve autocomplete functionality.
<br><br>

[![MIT License][license-badge]][License]
[![PRs Welcome][prs-badge]][prs]
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
<hr>

</div>
<div align="center">
<img src="https://gifyu.com/images/rta.gif" align="center" width="500">
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

## Options

These two props are different than with normal `<textarea />`, the rest is pretty same: `className, value, onChange,...`

| Option         | Default              |  Type           |  Description 
| :------------- | :-------------       | :-------------  |  ---------
| loadingComponent | *required*         | React Component | Gets `data` props which is already fetched (and displayed) suggestion 
| trigger | *required*         | Object (Trigger type) | Define triggers and their corresponding behavior

### Trigger type

```javascript 
{
    [triggerChar: string]: {
        ?output: (item: Object | string, trigger: ?string) => string,
        dataProvider: (token: string) => Promise<Array<Object | string>> | Array<Object | string>,
        component: ReactClass<*>,
    },
}
```

- **dataProvider** is called after each keystroke to get data what the suggestion list should display (array or promise resolving array)
- **component** is the component for render the item in suggestion list. It has `selected` and `entity` props provided by React Textarea Autocomplete
- **output** (Optional for string based item. If the item is an object this method is *required*) This function defines text which will be placed into textarea after the user makes a selection.

    Default behavior for string based item is string: `<current-trigger-char>item`). This method should **always** return a unique string.

## [Example of usage](http://react-textarea-autocomplete.surge.sh/)
```javascript
import React, { Component } from 'react';

// import React Textarea Autocomplete
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/dist/default-style.css';

import es from 'emoji-search';
import R from 'ramda';

const SmileItemComponent = props =>
  (<div>
    {props.entity.char} {props.entity.name}
  </div>);
  
const Loading = ({ data }) => <div>Loading</div>;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{ height: 200, width: 500 }}>
          <ReactTextareaAutocomplete
            loadingComponent={Loading}
            trigger={{
              ':': {
                output: (item, trigger) => `:${item.name}:`,
                dataProvider: (token) => {
                  if (!token) {
                    return [];
                  }
                  return R.take(10, es(token));
                },
                component: SmileItemComponent,
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
````

## Development

Run `yarn` to fetch dependencies.

Run `yarn dev` for bundling. 

In the folder run `yarn link` and then in your project folder `yarn link react-textarea-autocomplete` to link together.

Your PR's are welcomed! ❤️


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/8135252?v=4" width="100px;"/><br /><sub>Jakub Beneš</sub>](https://jukben.cz)<br />[💻](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben "Code") [📖](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=jukben "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/3114719?v=4" width="100px;"/><br /><sub>Andrey Taktaev</sub>](https://github.com/JokerNN)<br />[💻](https://github.com/webscopeio/react-textarea-autocomplete/commits?author=JokerNN "Code") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

<img src="https://media.giphy.com/media/AuIvUrZpzBl04/giphy.gif" width="500">

MIT

[npm]: https://www.npmjs.com/
[license-badge]: https://img.shields.io/npm/l/react-autocompletely.svg?style=flat-square
[license]: https://github.com/paypal/react-autocompletely/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
