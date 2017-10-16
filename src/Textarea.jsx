// @flow

import React from 'react';
import PropTypes from 'prop-types';
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

type triggerType = {
  [string]: {|
    output?: (Object | string, ?string) => string,
    dataProvider: dataProviderType,
    component: ReactClass<*>,
  |},
};

type Props = {
  trigger: triggerType,
  loadingComponent: ReactClass<*>,
  onChange?: (SyntheticEvent | Event) => void,
  value?: string,
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
  static defaultProps = {
    value: '',
    onChange: () => true,
  };

  constructor(props: Props) {
    super(props);

    Listeners.add(KEY_CODES.ESC, () => this.closeAutocomplete());

    const { loadingComponent, trigger, value } = this.props;

    if (value) this.state.value = value;
    this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}]\\w*$`);

    if (!loadingComponent) {
      throw new Error('RTA: loadingComponent is not defined');
    }

    if (!trigger) {
      throw new Error('RTA: trigger is not defined');
    }
  }

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

  componentDidMount() {
    Listeners.startListen();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.update(nextProps);
  }

  componentWillUnmount() {
    Listeners.stopListen();
  }

  onSelect = (newToken: string) => {
    const { selectionEnd, value: textareaValue } = this.state;
    const { onChange } = this.props;

    let offsetToEndOfToken = 0;
    while (
      textareaValue[selectionEnd + offsetToEndOfToken] &&
      /\S/.test(textareaValue[selectionEnd + offsetToEndOfToken])
    ) {
      offsetToEndOfToken += 1;
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
        dataLoading: false,
      },
      () => {
        // fire onChange event after successful selection
        const e = new Event('change', { bubbles: true });
        this.textareaRef.dispatchEvent(e);
        if (onChange) onChange(e);

        this.setTextareaCaret(newCaretPosition);
      },
    );
    this.closeAutocomplete();
  };

  getTextToReplace = (): ?getTextToReplaceType => {
    const { currentTrigger } = this.state;
    const triggerSettings = this.getCurrentTriggerSettings();

    if (!currentTrigger || !triggerSettings) return () => '';

    const { output } = triggerSettings;

    return (item: Object | string) => {
      if (
        typeof item === 'object' &&
        (!output || typeof output !== 'function')
      ) {
        throw new Error('RTA: Output function is not defined!');
      }

      if (output) {
        return output(item, currentTrigger);
      }

      // $FlowFixMe
      return `${currentTrigger}${item}${currentTrigger}`;
    };
  };

  setTextareaCaret = (position: number = 0) => {
    if (!this.textareaRef) return;

    this.textareaRef.focus();
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

  getSuggestions = (): ?Array<Object | string> => {
    const { currentTrigger, data } = this.state;

    if (!currentTrigger || !data || (data && !data.length)) return null;

    return data;
  };

  update({ value, trigger }: Props) {
    const { value: oldValue } = this.state;
    const { trigger: oldTrigger } = this.props;

    if (value !== oldValue || !oldValue) this.setState({ value });
    if (trigger !== oldTrigger || !this.tokenRegExp) {
      this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}]\\w*$`);
    }
  }

  closeAutocomplete = () => {
    if (!this.getSuggestions()) return;

    this.setState({ data: null });
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

    //eslint-disable-next-line
    for (const prop in props) {
      if (notSafe.includes(prop)) delete props[prop];
    }

    return props;
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

    const { top, left } = getCaretCoordinates(textarea, selectionEnd);
    this.setState({ top, left });

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

  props: Props;

  textareaRef: HTMLInputElement;

  tokenRegExp: RegExp;

  render() {
    const { loadingComponent: Loader, ...otherProps } = this.props;
    const { left, top, dataLoading, component, value } = this.state;

    const suggestionData = this.getSuggestions();
    const textToReplace = this.getTextToReplace();

    return (
      <div className={`rta ${dataLoading === true ? 'rta--loading' : ''}`}>
        <textarea
          ref={ref => (this.textareaRef = ref)}
          className={`rta__textarea ${otherProps.className || ''}`}
          onChange={this.changeHandler}
          value={value}
          {...this.cleanUpProps()}
        />
        {(dataLoading || suggestionData) &&
          <div style={{ top, left }} className="rta__autocomplete">
            {suggestionData &&
              component &&
              textToReplace &&
              <List
                values={suggestionData}
                component={component}
                getTextToReplace={textToReplace}
                onSelect={this.onSelect}
              />}
            {dataLoading &&
              <div
                className={`rta__loader ${suggestionData !== null
                  ? 'rta__loader--suggestion-data'
                  : 'rta__loader--empty-suggestion-data'}`}
              >
                <Loader data={suggestionData} />
              </div>}
          </div>}
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
        'Invalid prop trigger. Keys of the object has to be string.',
      );
    }

    // $FlowFixMe
    const { component, dataProvider } = settings;

    if (!component || typeof component !== 'function') {
      return Error('Invalid prop trigger: component should be defined.');
    }

    if (!dataProvider || typeof dataProvider !== 'function') {
      return Error('Invalid prop trigger: dataProvider should be defined.');
    }
  }

  return null;
};

ReactTextareaAutocomplete.propTypes = {
  trigger: triggerPropsCheck, //eslint-disable-line
  loadingComponent: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default ReactTextareaAutocomplete;
