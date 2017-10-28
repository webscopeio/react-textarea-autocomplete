import React, { Component } from 'react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import emoji from '@jukben/emoji-search';

/**
 * This code is bundled by Webpack from source so there is no need to import css
 * but in real-life application you may need to include it like this:
 *
 * import "@webscopeio/react-textarea-autocomplete/dist/default-style.css";
 */

const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;
class App extends Component {
  render() {
    return (
      <div>
        <ReactTextareaAutocomplete
          className="my-textarea"
          loadingComponent={Loading}
          style={{
            fontSize: '18px',
            lineHeight: '20px',
            padding: 5,
          }}
          containerStyle={{
            marginTop: 20,
            width: 400,
            height: 100,
            margin: '20px auto',
          }}
          minChar={0}
          trigger={{
            ':': {
              dataProvider: token => emoji(token)
                .slice(0, 10)
                .map(({ name, char }) => ({ name, char })),
              component: Item,
              output: (item, trigger) => item.char,
            },
          }}
        />
      </div>
    );
  }
}

export default App;
