// @flow
import React from 'react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import emoji from '@jukben/emoji-search';

// import '@webscopeio/react-textarea-autocomplete/style.css'
import '../style.css';

type ItemProps = {
  entity: {
    char: string,
    name: string,
  },
};

const Item = ({ entity: { name, char } }: ItemProps) => <div>{`${name}: ${char}`}</div>;

type LoadingProps = {
  data: Array<{ name: string, char: string }>,
};

const Loading = ({ data }: LoadingProps) => <div>Loading</div>;

class App extends React.Component {
  state = {
    optionsCaretStart: false,
    caretPosition: 0,
    text: '',
  };

  _handleOptionsCaretStart = () => {
    this.setState(({ optionsCaretStart }) => ({
      optionsCaretStart: !optionsCaretStart,
    }));
  };

  _onChangeHandle = ({ target: { value } }) => {
    this.setState({
      text: value,
    });
  };

  _onCaretPositionChangeHandle = (position: number) => {
    this.setState({
      caretPosition: position,
    });
  };

  _setCaretPosition = () => {
    this.rtaRef.setCaretPosition(1);
  };

  _getCaretPosition = () => {
    alert(this.rtaRef.getCaretPosition());
  };

  _getCarePosition = () => {};

  _outputCaretEnd = (item, trigger) => item.char;

  _outputCaretStart = item => ({ text: item.char, caretPosition: 'start' });

  render() {
    const { optionsCaretStart, caretPosition, text } = this.state;

    return (
      <div>
        <label>
          Place caret before word
          <input
            type="checkbox"
            defaultChecked={optionsCaretStart}
            onChange={this._handleOptionsCaretStart}
          />
        </label>
        <div>
          Actual caret position: <span data-test="actualCaretPosition">{caretPosition}</span>
        </div>
        <button onClick={this._setCaretPosition}>setCaretPosition(1);</button>
        <button onClick={this._getCaretPosition}>getCaretPosition();</button>

        <ReactTextareaAutocomplete
          className="one"
          ref={(ref) => {
            this.rtaRef = ref;
          }}
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
          onCaretPositionChange={this._onCaretPositionChangeHandle}
          minChar={0}
          value={text}
          onChange={this._onChangeHandle}
          trigger={{
            ':': {
              dataProvider: token =>
                emoji(token)
                  .slice(0, 10)
                  .map(({ name, char }) => ({ name, char })),
              component: Item,
              output: optionsCaretStart ? this._outputCaretStart : this._outputCaretEnd,
            },
          }}
        />
      </div>
    );
  }
}

export default App;
