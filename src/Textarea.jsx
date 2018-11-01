// @flow

import React from 'react';
import PropTypes from 'prop-types';
import getCaretCoordinates from 'textarea-caret';
import CustomEvent from 'custom-event';

import Listeners, { KEY_CODES } from './listener';
import List from './List';

import { defaultScrollToItem } from './utilities';

import type {
  TextareaProps,
  TextareaState,
  caretPositionType,
  outputType,
  triggerType,
  textToReplaceType,
  settingType,
} from './types';

const DEFAULT_CARET_POSITION = 'next';

const errorMessage = (message: string) =>
  console.error(
    `RTA: dataProvider fails: ${message}
    \nCheck the documentation or create issue if you think it's bug. https://github.com/webscopeio/react-textarea-autocomplete/issues`
  );

class ReactTextareaAutocomplete extends React.Component<
  TextareaProps,
  TextareaState
> {
  static defaultProps = {
    closeOnClickOutside: false,
    movePopupAsYouType: false,
    value: '',
    minChar: 1,
    scrollToItem: true,
  };

  constructor(props: TextareaProps) {
    super(props);

    Listeners.add(KEY_CODES.ESC, () => this._closeAutocomplete());

    const { loadingComponent, trigger, value } = this.props;

    if (value) this.state.value = value;

    this._createRegExp();

    if (!loadingComponent) {
      throw new Error('RTA: loadingComponent is not defined');
    }

    if (!trigger) {
      throw new Error('RTA: trigger is not defined');
    }
  }

  state = {
    top: null,
    left: null,
    currentTrigger: null,
    actualToken: '',
    data: null,
    value: '',
    dataLoading: false,
    selectionEnd: 0,
    selectionStart: 0,
    component: null,
  };

  componentDidMount() {
    Listeners.startListen();
  }

  componentDidUpdate({ trigger: oldTrigger }: TextareaProps) {
    const { trigger } = this.props;
    if (Object.keys(trigger).join('') !== Object.keys(oldTrigger).join('')) {
      this._createRegExp();
    }
  }

  static getDerivedStateFromProps({ value }: TextareaProps) {
    return {
      value,
    };
  }

  componentWillUnmount() {
    Listeners.stopListen();
  }

  getSelectionPosition = (): ?{|
    selectionStart: number,
    selectionEnd: number,
  |} => {
    if (!this.textareaRef) return null;

    return {
      selectionStart: this.textareaRef.selectionStart,
      selectionEnd: this.textareaRef.selectionEnd,
    };
  };

  getSelectedText = (): ?string => {
    if (!this.textareaRef) return null;
    const { selectionStart, selectionEnd } = this.textareaRef;

    if (selectionStart === selectionEnd) return null;

    return this.state.value.substr(
      selectionStart,
      selectionEnd - selectionStart
    );
  };

  setCaretPosition = (position: number = 0) => {
    if (!this.textareaRef) return;

    this.textareaRef.focus();
    this.textareaRef.setSelectionRange(position, position);
  };

  getCaretPosition = (): number => {
    if (!this.textareaRef) {
      return 0;
    }

    const position = this.textareaRef.selectionEnd;
    return position;
  };

  _onSelect = (newToken: textToReplaceType) => {
    const { selectionEnd, currentTrigger, value: textareaValue } = this.state;
    const { onChange, trigger } = this.props;

    if (!currentTrigger) return;

    const computeCaretPosition = (
      position: caretPositionType,
      token: string,
      startToken: number
    ): number => {
      switch (position) {
        case 'start':
          return startToken;
        case 'next':
        case 'end':
          return startToken + token.length;
        default:
          if (!Number.isInteger(position)) {
            throw new Error(
              'RTA: caretPosition should be "start", "next", "end" or number.'
            );
          }

          return position;
      }
    };

    const textToModify = textareaValue.slice(0, selectionEnd);

    const startOfTokenPosition = textToModify.search(
      /**
       * It's important to escape the currentTrigger char for chars like [, (,...
       */
      new RegExp(
        `\\${currentTrigger}${`[^\\${currentTrigger}${
          trigger[currentTrigger].allowWhitespace ? '' : '\\s'
        }]`}*$`
      )
    );

    // we add space after emoji is selected if a caret position is next
    const newTokenString =
      newToken.caretPosition === 'next' ? `${newToken.text} ` : newToken.text;

    const newCaretPosition = computeCaretPosition(
      newToken.caretPosition,
      newTokenString,
      startOfTokenPosition
    );

    const modifiedText =
      textToModify.substring(0, startOfTokenPosition) + newTokenString;

    const newValue = textareaValue.replace(textToModify, modifiedText);
    // set the new textarea value and after that set the caret back to its position
    this.setState(
      {
        value: newValue,
        dataLoading: false,
      },
      () => {
        // fire onChange event after successful selection
        const e = new CustomEvent('change', { bubbles: true });
        this.textareaRef.value = newValue;
        this.textareaRef.dispatchEvent(e);
        if (onChange) onChange(e);

        this.setCaretPosition(newCaretPosition);
      }
    );
    this._closeAutocomplete();
  };

  _getTextToReplace = (): ?outputType => {
    const { currentTrigger, actualToken } = this.state;
    const triggerSettings = this._getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) return null;

    const { output } = triggerSettings;

    return (item: Object | string) => {
      if (
        typeof item === 'object' &&
        (!output || typeof output !== 'function')
      ) {
        throw new Error(
          'Output functor is not defined! If you are using items as object you have to define "output" function. https://github.com/webscopeio/react-textarea-autocomplete#trigger-type'
        );
      }

      if (output) {
        const textToReplace = output(item, currentTrigger);

        if (!textToReplace || typeof textToReplace === 'number') {
          throw new Error(
            `Output functor should return string or object in shape {text: string, caretPosition: string | number}.\nGot "${String(
              textToReplace
            )}". Check the implementation for trigger "${
              currentTrigger
            }" and its token "${
              actualToken
            }"\n\nSee https://github.com/webscopeio/react-textarea-autocomplete#trigger-type for more informations.\n`
          );
        }

        if (typeof textToReplace === 'string') {
          return {
            text: textToReplace,
            caretPosition: DEFAULT_CARET_POSITION,
          };
        }

        if (!textToReplace.text) {
          throw new Error(
            `Output "text" is not defined! Object should has shape {text: string, caretPosition: string | number}. Check the implementation for trigger "${
              currentTrigger
            }" and its token "${actualToken}"\n`
          );
        }

        if (!textToReplace.caretPosition) {
          throw new Error(
            `Output "caretPosition" is not defined! Object should has shape {text: string, caretPosition: string | number}. Check the implementation for trigger "${
              currentTrigger
            }" and its token "${actualToken}"\n`
          );
        }

        return textToReplace;
      }

      if (typeof item !== 'string') {
        throw new Error('Output item should be string\n');
      }

      return {
        text: `${currentTrigger}${item}${currentTrigger}`,
        caretPosition: DEFAULT_CARET_POSITION,
      };
    };
  };

  _getCurrentTriggerSettings = (): ?settingType => {
    const { currentTrigger } = this.state;

    if (!currentTrigger) return null;

    return this.props.trigger[currentTrigger];
  };

  _getValuesFromProvider = () => {
    const { currentTrigger, actualToken } = this.state;
    const triggerSettings = this._getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) {
      return;
    }

    const { dataProvider, component } = triggerSettings;

    if (typeof dataProvider !== 'function') {
      throw new Error('Trigger provider has to be a function!');
    }

    this.setState({
      dataLoading: true,
    });

    let providedData = dataProvider(actualToken);

    if (!(providedData instanceof Promise)) {
      providedData = Promise.resolve(providedData);
    }

    providedData
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Trigger provider has to provide an array!');
        }

        if (typeof component !== 'function') {
          throw new Error('Component should be defined!');
        }

        // throw away if we resolved old trigger
        if (currentTrigger !== this.state.currentTrigger) return;

        // if we haven't resolved any data let's close the autocomplete
        if (!data.length) {
          this._closeAutocomplete();
          return;
        }

        this.setState({
          dataLoading: false,
          data,
          component,
        });
      })
      .catch(e => errorMessage(e.message));
  };

  _getSuggestions = (): ?Array<Object | string> => {
    const { currentTrigger, data } = this.state;

    if (!currentTrigger || !data || (data && !data.length)) return null;

    return data;
  };

  _createRegExp = () => {
    const { trigger } = this.props;

    // negative lookahead to match only the trigger + the actual token = "bladhwd:adawd:word test" => ":word"
    // https://stackoverflow.com/a/8057827/2719917
    this.tokenRegExp = new RegExp(
      `([${Object.keys(trigger).join('')}])(?:(?!\\1)[^\\s])*$`
    );
  };

  /**
   * Close autocomplete, also clean up trigger (to avoid slow promises)
   */
  _closeAutocomplete = () => {
    this.setState({
      data: null,
      dataLoading: false,
      currentTrigger: null,
      top: null,
      left: null,
    });
  };

  _cleanUpProps = (): Object => {
    const props = { ...this.props };
    const notSafe = [
      'loadingComponent',
      'containerStyle',
      'minChar',
      'scrollToItem',
      'ref',
      'innerRef',
      'onChange',
      'onCaretPositionChange',
      'className',
      'value',
      'trigger',
      'listStyle',
      'itemStyle',
      'containerStyle',
      'loaderStyle',
      'className',
      'containerClassName',
      'listClassName',
      'itemClassName',
      'loaderClassName',
      'closeOnClickOutside',
      'dropdownStyle',
      'dropdownClassName',
      'movePopupAsYouType',
    ];

    // eslint-disable-next-line
    for (const prop in props) {
      if (notSafe.includes(prop)) delete props[prop];
    }

    return props;
  };

  _changeHandler = (e: SyntheticInputEvent<*>) => {
    const {
      trigger,
      onChange,
      minChar,
      onCaretPositionChange,
      movePopupAsYouType,
    } = this.props;
    const { top, left } = this.state;

    const textarea = e.target;
    const { selectionEnd, selectionStart } = textarea;
    const value = textarea.value;

    if (onChange) {
      e.persist();
      onChange(e);
    }

    if (onCaretPositionChange) {
      const caretPosition = this.getCaretPosition();
      onCaretPositionChange(caretPosition);
    }

    this.setState({
      value,
    });

    let tokenMatch = this.tokenRegExp.exec(value.slice(0, selectionEnd));
    let lastToken = tokenMatch && tokenMatch[0];

    let currentTrigger =
      (lastToken && Object.keys(trigger).find(a => a === lastToken[0])) || null;

    /*
     if we lost the trigger token or there is no following character we want to close
     the autocomplete
    */
    if (
      (!lastToken || lastToken.length <= minChar) &&
      // check if our current trigger disallows whitespace
      ((this.state.currentTrigger &&
        !trigger[this.state.currentTrigger].allowWhitespace) ||
        !this.state.currentTrigger)
    ) {
      this._closeAutocomplete();
      return;
    }

    /**
     * This code has to be sync that is the reason why we obtain the currentTrigger
     * from currentTrigger not this.state.currentTrigger
     *
     * Check if the currently typed token has to be afterWhitespace, or not.
     */
    if (
      currentTrigger &&
      value[tokenMatch.index - 1] &&
      (trigger[currentTrigger].afterWhitespace &&
        !value[tokenMatch.index - 1].match(/\s/))
    ) {
      this._closeAutocomplete();
      return;
    }

    /**
      If our current trigger allows whitespace
      get the correct token for DataProvider, so we need to construct new RegExp
     */
    if (
      this.state.currentTrigger &&
      trigger[this.state.currentTrigger].allowWhitespace
    ) {
      tokenMatch = new RegExp(
        `\\${this.state.currentTrigger}[^${this.state.currentTrigger}]*$`
      ).exec(value.slice(0, selectionEnd));
      lastToken = tokenMatch && tokenMatch[0];

      if (!lastToken) {
        this._closeAutocomplete();
        return;
      }

      currentTrigger =
        Object.keys(trigger).find(a => a === lastToken[0]) || null;
    }

    const actualToken = lastToken.slice(1);

    // if trigger is not configured step out from the function, otherwise proceed
    if (!currentTrigger) {
      return;
    }

    if (
      movePopupAsYouType ||
      (top === null && left === null) ||
      // if we have single char - trigger it means we want to re-position the autocomplete
      lastToken.length === 1
    ) {
      const { top: newTop, left: newLeft } = getCaretCoordinates(
        textarea,
        selectionEnd
      );

      this.setState({
        // make position relative to textarea
        top: newTop - this.textareaRef.scrollTop || 0,
        left: newLeft,
      });
    }

    this.setState(
      {
        selectionEnd,
        selectionStart,
        currentTrigger,
        actualToken,
      },
      () => {
        try {
          this._getValuesFromProvider();
        } catch (err) {
          errorMessage(err.message);
        }
      }
    );
  };

  _selectHandler = (e: SyntheticInputEvent<*>) => {
    const { onCaretPositionChange, onSelect } = this.props;

    if (onCaretPositionChange) {
      const caretPosition = this.getCaretPosition();
      onCaretPositionChange(caretPosition);
    }

    if (onSelect) {
      e.persist();
      onSelect(e);
    }
  };

  _onClickAndBlurHandler = (e: SyntheticFocusEvent<*>) => {
    const { closeOnClickOutside, onBlur } = this.props;

    // If this is a click: e.target is the textarea, and e.relatedTarget is the thing
    // that was actually clicked. If we clicked inside the autoselect dropdown, then
    // that's not a blur, from the autoselect's point of view, so then do nothing.
    const el = e.relatedTarget;
    if (
      this.dropdownRef &&
      el instanceof Node &&
      this.dropdownRef.contains(el)
    ) {
      return;
    }

    if (closeOnClickOutside) {
      this._closeAutocomplete();
    }

    if (onBlur) {
      e.persist();
      onBlur(e);
    }
  };

  _onScrollHandler = () => {
    this._closeAutocomplete();
  };

  _dropdownScroll = (item: HTMLDivElement) => {
    const { scrollToItem } = this.props;

    if (!scrollToItem) return;

    if (scrollToItem === true) {
      defaultScrollToItem(this.dropdownRef, item);
      return;
    }

    if (typeof scrollToItem !== 'function' || scrollToItem.length !== 2) {
      throw new Error(
        '`scrollToItem` has to be boolean (true for default implementation) or function with two parameters: container, item.'
      );
    }

    scrollToItem(this.dropdownRef, item);
  };

  props: TextareaProps;

  textareaRef: HTMLInputElement;

  dropdownRef: HTMLDivElement;

  tokenRegExp: RegExp;

  render() {
    const {
      loadingComponent: Loader,
      style,
      className,
      listStyle,
      itemStyle,
      listClassName,
      itemClassName,
      dropdownClassName,
      dropdownStyle,
      containerStyle,
      containerClassName,
      loaderStyle,
      loaderClassName,
    } = this.props;
    const {
      left,
      top,
      dataLoading,
      currentTrigger,
      component,
      value,
    } = this.state;

    const suggestionData = this._getSuggestions();
    const textToReplace = this._getTextToReplace();

    return (
      <div
        className={`rta ${
          dataLoading === true ? 'rta--loading' : ''
        } ${containerClassName || ''}`}
        style={containerStyle}
      >
        <textarea
          {...this._cleanUpProps()}
          ref={ref => {
            this.props.innerRef && this.props.innerRef(ref);
            this.textareaRef = ref;
          }}
          className={`rta__textarea ${className || ''}`}
          onChange={this._changeHandler}
          onSelect={this._selectHandler}
          onScroll={this._onScrollHandler}
          onClick={
            // The textarea itself is outside the autoselect dropdown.
            this._onClickAndBlurHandler
          }
          onBlur={this._onClickAndBlurHandler}
          value={value}
          style={style}
        />
        {(dataLoading || suggestionData) &&
          currentTrigger && (
            <div
              ref={ref => {
                // $FlowFixMe
                this.dropdownRef = ref;
              }}
              style={{ top, left, ...dropdownStyle }}
              className={`rta__autocomplete ${dropdownClassName || ''}`}
            >
              {suggestionData &&
                component &&
                textToReplace && (
                  <List
                    values={suggestionData}
                    component={component}
                    style={listStyle}
                    className={listClassName}
                    itemClassName={itemClassName}
                    itemStyle={itemStyle}
                    getTextToReplace={textToReplace}
                    onSelect={this._onSelect}
                    dropdownScroll={this._dropdownScroll}
                  />
                )}
              {dataLoading && (
                <div
                  className={`rta__loader ${
                    suggestionData !== null
                      ? 'rta__loader--suggestion-data'
                      : 'rta__loader--empty-suggestion-data'
                  } ${loaderClassName || ''}`}
                  style={loaderStyle}
                >
                  <Loader data={suggestionData} />
                </div>
              )}
            </div>
          )}
      </div>
    );
  }
}

const triggerPropsCheck = ({ trigger }: { trigger: triggerType }) => {
  if (!trigger) return Error('Invalid prop trigger. Prop missing.');

  const triggers = Object.entries(trigger);

  for (let i = 0; i < triggers.length; i += 1) {
    const [triggerChar, settings] = triggers[i];

    if (typeof triggerChar !== 'string' || triggerChar.length !== 1) {
      return Error(
        'Invalid prop trigger. Keys of the object has to be string / one character.'
      );
    }

    // $FlowFixMe
    const triggerSetting: triggerType = settings;

    const {
      component,
      dataProvider,
      output,
      afterWhitespace,
      allowWhitespace,
    } = triggerSetting;

    if (!component || typeof component !== 'function') {
      return Error('Invalid prop trigger: component should be defined.');
    }

    if (!dataProvider || typeof dataProvider !== 'function') {
      return Error('Invalid prop trigger: dataProvider should be defined.');
    }

    if (output && typeof output !== 'function') {
      return Error('Invalid prop trigger: output should be a function.');
    }

    if (afterWhitespace && allowWhitespace) {
      return Error(
        'Invalid prop trigger: afterWhitespace and allowWhitespace can be used together'
      );
    }
  }

  return null;
};

ReactTextareaAutocomplete.propTypes = {
  loadingComponent: PropTypes.func.isRequired,
  minChar: PropTypes.number,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onBlur: PropTypes.func,
  onCaretPositionChange: PropTypes.func,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  closeOnClickOutside: PropTypes.bool,
  style: PropTypes.object,
  listStyle: PropTypes.object,
  itemStyle: PropTypes.object,
  loaderStyle: PropTypes.object,
  dropdownStyle: PropTypes.object,
  listClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  loaderClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  value: PropTypes.string,
  trigger: triggerPropsCheck, //eslint-disable-line
};

export default ReactTextareaAutocomplete;
