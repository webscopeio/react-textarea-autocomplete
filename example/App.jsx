import React, { Component } from 'react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import emoji from '@jukben/emoji-search';

import '@webscopeio/react-textarea-autocomplete/style.css'

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
