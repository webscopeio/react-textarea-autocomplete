// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getCaretCoordinates from 'textarea-caret';

import Listeners, { KEY_CODES } from './listener';
import List from './List';

type dataProviderType = string =>
  | Promise<Array<Object | string>>
  | Array<Object | string>;

type settingType = {
  component: ReactClass<*>,
  dataProvider: dataProviderType,
  output?: (Object | string, ?string) => string,
};

type getTextToReplaceType = (Object | string) => string;

type Props = {
  trigger: {
    [string]: {
      output?: (Object | string, ?string) => string,
      dataProvider: dataProviderType,
      component: ReactClass<*>,
    },
  },
  loadingComponent: Function,
  onChange: SyntheticEvent => void,
};

type State = {
  currentTrigger: ?string,
  top: number,
  left: number,
  actualToken: string,
  data: ?Array<Object | string>,
  value: string,
  dataLoading: boolean,
  selectionEnd: number,
  selectionStart: number,
  component: ?ReactClass<*>,
};

class ReactTextareaAutocomplete extends React.Component {
  props: Props;

  update = (prevProps: Props) => {
    const { trigger } = this.props;
    this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}]\\w*$`);
  };

  componentDidMount() {
    this.update(this.props);
    Listeners.add(KEY_CODES.ESC, e => this.closeAutocomplete());

    const { loadingComponent, trigger } = this.props;

    if (!loadingComponent) {
      throw new Error('RTA: loadingComponent is not defined');
    }

    if (!trigger) {
      throw new Error('RTA: trigger is not defined');
    }
  }

  componentWillUnmount() {
    Listeners.removeAll();
  }

  componentDidUpdate(prevProps: Props) {
    this.update(prevProps);
  }

  textareaRef: ?HTMLInputElement = null;

  tokenRegExp: RegExp;

  state: State = {
    top: 0,
    left: 0,
    currentTrigger: null,
    actualToken: '',
    data: null,
    value: '',
    dataLoading: false,
    selectionEnd: 0,
    selectionStart: 0,
    component: null,
  };

  changeHandler = (e: SyntheticInputEvent) => {
    const { trigger, onChange } = this.props;
    const textarea = e.target;
    const { selectionEnd, selectionStart } = textarea;
    const value = textarea.value;

    if (onChange) {
      e.persist();
      onChange(e);
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
    if (!lastToken || lastToken.length <= 1) {
      this.closeAutocomplete();
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

    /* 
      JSDOM has some issue with getComputedStyles which is called by getCaretCoordinates
      so this try - catch is walk-around for Jest 
    */
    try {
      const { top, left } = getCaretCoordinates(textarea, selectionEnd);
      this.setState({ top, left });
    } catch (e) {
      console.warn(
        'RTA: failed to get caret coordinates. This is not a browser?',
      );
    }

    this.setState(
      {
        selectionEnd,
        selectionStart,
        currentTrigger,
        actualToken,
      },
      this.getValuesFromProvider,
    );
  };

  getTextToReplace = (): ?getTextToReplaceType => {
    const { currentTrigger } = this.state;
    const triggerSettings = this.getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) return;

    const { output } = triggerSettings;

    return (item: Object | string) => {
      if (typeof item === 'object') {
        if (!output || typeof output !== 'function') {
          throw new Error('RTA: Output function is not defined!');
        }

        return output(item, currentTrigger);
      }

      return currentTrigger + item;
    };
  };

  closeAutocomplete = () => {
    if (!this.getSuggestions()) return;

    this.setState({ data: null });
  };

  onSelect = (newToken: string) => {
    const {
      actualToken,
      selectionEnd,
      selectionStart,
      value: textareaValue,
    } = this.state;

    let offsetToEndOfToken = 0;
    while (
      textareaValue[selectionEnd + offsetToEndOfToken] &&
      /\S/.test(textareaValue[selectionEnd + offsetToEndOfToken])
    ) {
      offsetToEndOfToken++;
    }

    const textToModify = textareaValue.slice(
      0,
      selectionEnd + offsetToEndOfToken,
    );

    const startOfTokenPosition = textToModify.search(/\S*$/);
    const newCaretPosition = startOfTokenPosition + newToken.length;
    const modifiedText =
      textToModify.substring(0, startOfTokenPosition) + newToken;

    // set the new textarea value and after that set the caret back to its position
    this.setState(
      {
        value: textareaValue.replace(textToModify, modifiedText),
      },
      () => this.setTextareaCaret(newCaretPosition),
    );
    this.closeAutocomplete();
  };

  setTextareaCaret = (position: number = 0) => {
    if (!this.textareaRef) return;

    this.textareaRef.setSelectionRange(position, position);
  };

  getCurrentTriggerSettings = (): ?settingType => {
    const { currentTrigger } = this.state;

    if (!currentTrigger) return null;

    return this.props.trigger[currentTrigger];
  };

  getValuesFromProvider = () => {
    const { currentTrigger, actualToken } = this.state;
    const triggerSettings = this.getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) {
      return;
    }

    const { dataProvider, component } = triggerSettings;

    if (typeof dataProvider !== 'function') {
      throw new Error('RTA: Trigger provider has to be a function!');
    }

    this.setState({
      dataLoading: true,
      data: null,
    });

    let providedData = dataProvider(actualToken);

    if (!(providedData instanceof Promise)) {
      providedData = Promise.resolve(providedData);
    }

    providedData
      .then(data => {
        if (typeof providedData !== 'object') {
          throw new Error('RTA: Trigger provider has to provide an array!');
        }

        if (typeof component !== 'function') {
          throw new Error('RTA: Component should be defined!');
        }

        this.setState({
          dataLoading: false,
          data,
          component,
        });
      })
      .catch(e => {
        throw new Error(`RTA: dataProvider fails: ${e.message}`);
      });
  };

  cleanUpProps = (): Object => {
    const props = { ...this.props };
    const notSafe = [
      'loadingComponent',
      'ref',
      'onChange',
      'className',
      'value',
      'trigger',
    ];

    for (let prop in props) {
      if (notSafe.includes(prop)) delete props[prop];
    }

    return props;
  };

  getSuggestions = (): ?Array<Object | string> => {
    const { currentTrigger, data } = this.state;

    if (!currentTrigger || !data || (data && !data.length)) return null;

    return data;
  };

  render() {
    const { loadingComponent: Loader, ...otherProps } = this.props;
    const {
      left,
      top,
      currentTrigger,
      dataLoading,
      component,
      value,
    } = this.state;

    const suggestionData = this.getSuggestions();
    const textToReplace = this.getTextToReplace();

    return (
      <div className={classNames('rta', { 'rta--loading': dataLoading })}>
        <textarea
          ref={ref => (this.textareaRef = ref)}
          className={'rta__textarea ' + (otherProps['className'] || '')}
          onChange={this.changeHandler}
          value={value}
          {...this.cleanUpProps()}
        />
        {(dataLoading || suggestionData) &&
          <div style={{ top, left }} className="rta__autocomplete">
            {dataLoading &&
              <div className="rta__loader">
                <Loader />
              </div>}
            {suggestionData &&
              component &&
              textToReplace &&
              <List
                values={suggestionData}
                component={component}
                getTextToReplace={textToReplace}
                onSelect={this.onSelect}
              />}
          </div>}
      </div>
    );
  }
}

ReactTextareaAutocomplete.propTypes = {
  trigger: PropTypes.object.isRequired,
  loadingComponent: PropTypes.func.isRequired,
};

export default ReactTextareaAutocomplete;
