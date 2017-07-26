# React Textarea Autocomplete

## Options

These two props are different than with normal `<textarea/>`, the rest is pretty same: `className, value, onChange,...`

| Option         | Default              |  Type           |  Description 
| :------------- | :-------------       | :-------------  |  ---------
| loadingComponent | *required*         | React Component | Gets `data` props which is already fetched (and displayed) suggestion 
| trigger | *required*         | Object | Define triggers and their corresponding behavior

### Trigger type

```javascript 
{
    ':': {
        ?output: (item: Object | string, trigger: ?string) => string,
        dataProvider: (token: string) => Promise<Array<Object | string>> | Array<Object | string>,
        component: ReactClass<*>,
    },
}
```

- **dataProvider** is called after each keystroke to get what the suggestion list should display
- **component** is the component for render the item in suggestion list
- **output** optional is data provider provide array of string. This function define what text will be replaced after user select. (default behavior for string type of item is string: `current trigger char + item`)

## Example of use
```javascript
import React, { Component } from 'react';

// import React Textarea Autocomplete
import ReactTextareaAutocomplete from 'react-textarea-autocomplete';
import 'react-textarea-autocomplete/dist/default-style.css';

import es from 'emoji-search';
import R from 'ramda';

const SmileItemComponent = props =>
  (<div>
    {props.entity.char} {props.entity.name}
  </div>);
const Loading = ({ data }) => <div>Loading</div>;

class App extends Component {
  render() {
    const { a } = this.state;
    return (
      <div className="App">
        <div style={{ height: 200, width: 500 }}>
          <ReactTextareaAutocomplete
            placeholder={'aa'}
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

## License

<img src="https://media.giphy.com/media/AuIvUrZpzBl04/giphy.gif" width="500">

MIT
