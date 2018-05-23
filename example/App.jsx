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

const Item = ({ entity: { name, char } }: ItemProps) => (
  <div>{`${name}: ${char}`}</div>
);

type LoadingProps = {
  data: Array<{ name: string, char: string }>,
};

const Loading = ({ data }: LoadingProps) => <div>Loading</div>;

class App extends React.Component {
  state = {
    optionsCaretStart: false,
    clickoutsideOption: false,
    caretPosition: 0,
    movePopupAsYouType: false,
    text: '',
    optionsCaret: 'start',
    actualTokenInProvider: '',
  };

  _handleOptionsCaretEnd = () => {
    this.setState(() => ({
      optionsCaret: 'end',
    }));
  };

  _handleOptionsCaretNext = () => {
    this.setState(() => ({
      optionsCaret: 'next',
    }));
  };

  _handleOptionsCaretStart = () => {
    this.setState(() => ({
      optionsCaret: 'start',
    }));
  };

  _handleClickoutsideOption = () => {
    this.setState(({ clickoutsideOption }) => ({
      clickoutsideOption: !clickoutsideOption,
    }));
  };

  _handleMovePopupAsYouType = () => {
    this.setState(({ movePopupAsYouType }) => ({
      movePopupAsYouType: !movePopupAsYouType,
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

  _outputCaretEnd = (item, trigger) => ({
    text: item.char,
    caretPosition: 'end',
  });

  _outputCaretStart = item => ({ text: item.char, caretPosition: 'start' });

  _outputCaretNext = item => ({ text: item.char, caretPosition: 'next' });

  _getSelectionPosition = () => {
    alert(JSON.stringify(this.rtaRef.getSelectionPosition()));
  };

  _getSelectedText = () => {
    alert(this.rtaRef.getSelectedText());
  };

  /**
   * it's the same as _outputCaretNext
   */
  _outputCaretDefault = item => item.char;

  _focus = () => {
    this.textareaRef.focus();
  };

  render() {
    const {
      optionsCaret,
      caretPosition,
      clickoutsideOption,
      movePopupAsYouType,
      actualTokenInProvider,
      text,
    } = this.state;

    return (
      <div>
        <div>
          <input
            id="caretStart"
            name="caret"
            value="start"
            type="radio"
            checked={this.state.optionsCaret === 'start'}
            onChange={this._handleOptionsCaretStart}
          />
          <label htmlFor="caretStart">Place caret before word</label>

          <input
            id="caretEnd"
            name="caret"
            value="end"
            type="radio"
            checked={this.state.optionsCaret === 'end'}
            onChange={this._handleOptionsCaretEnd}
          />
          <label htmlFor="caretEnd">Place caret after word</label>

          <input
            id="caretNext"
            name="caret"
            value="next"
            type="radio"
            checked={this.state.optionsCaret === 'next'}
            onChange={this._handleOptionsCaretNext}
          />
          <label htmlFor="caretNext">Place caret after word with a space</label>
        </div>
        <div>
          <label>
            <input
              data-test="clickoutsideOption"
              type="checkbox"
              defaultChecked={clickoutsideOption}
              onChange={this._handleClickoutsideOption}
            />
            Close when click outside
          </label>
        </div>
        <div>
          <label>
            <input
              data-test="movePopupAsYouType"
              type="checkbox"
              defaultChecked={movePopupAsYouType}
              onChange={this._handleMovePopupAsYouType}
            />
            Move popup as you type
          </label>
        </div>
        <div>
          Actual caret position:{' '}
          <span data-test="actualCaretPosition">{caretPosition}</span>
        </div>
        <button data-test="setCaretPosition" onClick={this._setCaretPosition}>
          setCaretPosition(1);
        </button>
        <button data-test="getCaretPosition" onClick={this._getCaretPosition}>
          getCaretPosition();
        </button>
        <button
          data-test="getSelectionPosition"
          onClick={this._getSelectionPosition}
        >
          getSelectionPosition();
        </button>
        <button data-test="getSelectedText" onClick={this._getSelectedText}>
          getSelectedText();
        </button>
        <button data-test="focus" onClick={this._focus}>
          Focus the textarea
        </button>
        <div>
          Actual token in "[" provider:{' '}
          <span data-test="actualToken">{actualTokenInProvider}</span>
        </div>

        <ReactTextareaAutocomplete
          className="one"
          ref={ref => {
            this.rtaRef = ref;
          }}
          innerRef={ref => {
            this.textareaRef = ref;
          }}
          loadingComponent={Loading}
          style={{
            padding: 5,
          }}
          containerStyle={{
            marginTop: 20,
            width: 400,
            height: 100,
            margin: '20px auto',
          }}
          movePopupAsYouType={movePopupAsYouType}
          closeOnClickOutside={clickoutsideOption}
          onCaretPositionChange={this._onCaretPositionChangeHandle}
          minChar={0}
          value={text}
          onChange={this._onChangeHandle}
          trigger={{
            ':': {
              dataProvider: token =>
                emoji(token)
                  .slice(0, 10)
                  .filter(({ char }) => char)
                  .map(({ name, char }) => ({ name, char })),
              component: Item,
              output: {
                start: this._outputCaretStart,
                end: this._outputCaretEnd,
                next: this._outputCaretNext,
              }[optionsCaret],
            },
            '@': {
              dataProvider: token =>
                new Promise(res =>
                  setTimeout(() => {
                    res([{ name: 'jakub', char: 'Jakub' }]);
                  }, 1000)
                ),
              component: Item,
              output: {
                start: this._outputCaretStart,
                end: this._outputCaretEnd,
                next: this._outputCaretDefault,
              }[optionsCaret],
            },
            // test of special character
            '[': {
              dataProvider: token => {
                /**
                  Let's pass token to state to easily test it in Cypress 
                  We going to test that we get also whitespace because this trigger has set "allowWhitespace"  
                 */
                this.setState({ actualTokenInProvider: token });
                return [
                  { name: 'alt', char: '@' },
                  { name: 'another character', char: '/' },
                ];
              },
              component: Item,
              allowWhitespace: true,
              output: {
                start: this._outputCaretStart,
                end: this._outputCaretEnd,
                next: this._outputCaretNext,
              }[optionsCaret],
            },
            ';': {
              dataProvider: token => [
                { name: '1', char: 'one' },
                { name: '2', char: 'two' },
              ],
              component: Item,
              afterWhitespace: true,
              output: {
                start: this._outputCaretStart,
                end: this._outputCaretEnd,
                next: this._outputCaretNext,
              }[optionsCaret],
            },
          }}
        />
      </div>
    );
  }
}

export default App;
