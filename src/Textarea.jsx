// @flow

import React from 'react';
import PropTypes from 'prop-types';
import getCaretCoordinates from 'textarea-caret';

import Listeners, { KEY_CODES } from './listener';
import List from './List';

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
    `RTA: dataProvider fails: ${
      message
    } Check the documentation or create issue if you think it's bug. https://github.com/webscopeio/react-textarea-autocomplete/issues`
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

  componentWillReceiveProps(nextProps: TextareaProps) {
    this._update(nextProps);
  }

  componentWillUnmount() {
    Listeners.stopListen();
  }

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
    const { onChange } = this.props;

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

    let offsetToEndOfToken = 0;
    while (
      textareaValue[selectionEnd + offsetToEndOfToken] &&
      /\S/.test(textareaValue[selectionEnd + offsetToEndOfToken])
    ) {
      offsetToEndOfToken += 1;
    }

    const textToModify = textareaValue.slice(
      0,
      selectionEnd + offsetToEndOfToken
    );

    const startOfTokenPosition = textToModify.search(
      /**
       * It's important to enscape the currentTrigger char for chars like [, (,...
       */
      new RegExp(`\\${currentTrigger}\\S*$`)
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

    // set the new textarea value and after that set the caret back to its position
    this.setState(
      {
        value: textareaValue.replace(textToModify, modifiedText),
        dataLoading: false,
      },
      () => {
        // fire onChange event after successful selection
        const e = new Event('change', { bubbles: true });
        this.textareaRef.dispatchEvent(e);
        if (onChange) onChange(e);

        this.setCaretPosition(newCaretPosition);
      }
    );
    this._closeAutocomplete();
  };

  _getTextToReplace = (): ?outputType => {
    const { currentTrigger } = this.state;
    const triggerSettings = this._getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) return null;

    const { output } = triggerSettings;

    return (item: Object | string) => {
      if (
        typeof item === 'object' &&
        (!output || typeof output !== 'function')
      ) {
        throw new Error('Output function is not defined!');
      }

      if (output) {
        const textToReplace = output(item, currentTrigger);

        if (typeof textToReplace === 'string') {
          return {
            text: textToReplace,
            caretPosition: DEFAULT_CARET_POSITION,
          };
        }

        if (!textToReplace.text) {
          throw new Error(
            'Outupt "text" is not defined! Object should has shape {text: string, caretPosition: string | number}.'
          );
        }

        if (!textToReplace.caretPosition) {
          throw new Error(
            'Outupt "caretPosition" is not defined! Object should has shape {text: string, caretPosition: string | number}.'
          );
        }

        return textToReplace;
      }

      if (typeof item !== 'string') {
        throw new Error('Output item should be string.');
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
        if (typeof providedData !== 'object') {
          throw new Error('Trigger provider has to provide an array!');
        }

        if (typeof component !== 'function') {
          throw new Error('Component should be defined!');
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

    this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}][^\\s]*$`);
  };

  _update({ value, trigger }: TextareaProps) {
    const { value: oldValue } = this.state;
    const { trigger: oldTrigger } = this.props;

    if (value !== oldValue || !oldValue) this.setState({ value });
    /**
     * check if trigger chars are changed, if so, change the regexp accordingly
     */
    if (Object.keys(trigger).join('') !== Object.keys(oldTrigger).join('')) {
      this._createRegExp();
    }
  }

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
      'ref',
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

    const tokenMatch = this.tokenRegExp.exec(value.slice(0, selectionEnd));
    const lastToken = tokenMatch && tokenMatch[0];

    /*
     if we lost the trigger token or there is no following character we want to close
     the autocomplete
    */
    if (!lastToken || lastToken.length <= minChar) {
      this._closeAutocomplete();
      return;
    }

    const triggerChars = Object.keys(trigger);

    const currentTrigger =
      (lastToken && triggerChars.find(a => a === lastToken[0])) || null;

    const actualToken = lastToken.slice(1);

    // if trigger is not configured step out from the function, otherwise proceed
    if (!currentTrigger) {
      return;
    }

    if (movePopupAsYouType || (top === null && left === null)) {
      this.setState(getCaretCoordinates(textarea, selectionEnd));
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

  props: TextareaProps;

  textareaRef: HTMLInputElement;

  dropdownRef: ?HTMLDivElement;

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
            this.textareaRef = ref;
          }}
          className={`rta__textarea ${className || ''}`}
          onChange={this._changeHandler}
          onSelect={this._selectHandler}
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
    const { component, dataProvider, output } = settings;

    if (!component || typeof component !== 'function') {
      return Error('Invalid prop trigger: component should be defined.');
    }

    if (!dataProvider || typeof dataProvider !== 'function') {
      return Error('Invalid prop trigger: dataProvider should be defined.');
    }

    if (output && typeof output !== 'function') {
      return Error('Invalid prop trigger: output should be a function.');
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
