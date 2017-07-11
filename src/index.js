//@flow

import React from 'react';
import PropTypes from 'prop-types';
import getCaretCoordinates from 'textarea-caret';
import classNames from 'classnames';

import './style.css';

const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
};

const Listeners = (function() {
  let i = 0;
  const listeners: {
    [number]: {| keyCode: number | Array<number>, fn: Function |},
  } = {};

  const f = (keyCode, fn, e) => {
    const code = e.keyCode || e.which;
    if (typeof keyCode !== 'object') keyCode = [keyCode];
    if (
      keyCode.includes(code) && // $FlowFixMe
      Object.values(listeners).find(
        ({ keyCode: triggerKeyCode }) => triggerKeyCode === keyCode,
      )
    )
      return fn(e);
  };

  const addListener = (keyCode: Array<number> | number, fn: Function) => {
    listeners[i] = {
      keyCode,
      fn,
    };

    // $FlowFixMe
    document.addEventListener('keydown', e => f(keyCode, fn, e));

    return i++;
  };

  const removeListener = (id: number) => {
    delete listeners[id];
    i--;
  };

  // $FlowFixMe
  const removeAllListeners = () => document.removeEventListener('keydown', f);

  return {
    add: addListener,
    remove: removeListener,
    removeAll: removeAllListeners,
  };
})();

type ItemProps = {
  component: React$Component<*, *, *>,
  onMouseEnterHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: SyntheticEvent => void,
  selected: boolean,
};

class Item extends React.Component {
  props: ItemProps;

  onMouseEnterHandler = () => {
    const { item, onMouseEnterHandler } = this.props;
    onMouseEnterHandler(item);
  };

  render() {
    const {
      component: Component,
      onMouseEnterHandler,
      onClickHandler,
      item,
      selected,
    } = this.props;

    return (
      <li
        className={classNames('rta__item', { 'rta__item--selected': selected })}
        onClick={onClickHandler}
        onMouseEnter={this.onMouseEnterHandler}
      >
        {/*$FlowFixMe*/}
        <Component selected={selected} entity={item} />
      </li>
    );
  }
}

class List extends React.PureComponent {
  listeners: Array<number> = [];

  constructor() {
    super();
  }

  state: {
    selected: ?boolean,
    selectedItem: ?Object | ?string,
  } = {
    selected: null,
    selectedItem: null,
  };

  getPositionInList = () => {
    const { values } = this.props;
    const { selectedItem } = this.state;

    if (!selectedItem) return 0;

    return values.findIndex(a => this.getId(a) === this.getId(selectedItem));
  };

  scroll = e => {
    e.preventDefault();

    const { values } = this.props;

    const code = e.keyCode || e.which;

    const oldPosition = this.getPositionInList();
    let newPosition;
    switch (code) {
      case KEY_CODES.DOWN:
        newPosition = oldPosition + 1;
        break;
      case KEY_CODES.UP:
        newPosition = oldPosition - 1;
        break;
      default:
        newPosition = oldPosition;
        break;
    }

    newPosition = (newPosition % values.length + values.length) % values.length;
    this.setState({ selectedItem: values[newPosition] });
  };

  onPressEnter = e => {
    e.preventDefault();

    const { values } = this.props;

    this.modifyText(values[this.getPositionInList()]);
  };

  modifyText = value => {
    const { onSelect, getTextToReplace } = this.props;
    onSelect(getTextToReplace(value));
  };

  selectItem = item => {
    this.setState({ selectedItem: item });
  };

  componentDidMount() {
    const { values } = this.props;

    this.setState({
      selectedItem: values[0],
    });

    this.listeners.push(
      Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll),
      Listeners.add([KEY_CODES.ENTER], this.onPressEnter),
    );
  }

  componentWillUnmount() {
    let listener;
    while ((listener = this.listeners.pop())) Listeners.remove(listener);
  }

  getId = (item: Object | string): string => {
    return this.props.getTextToReplace(item);
  };

  isSelected = (item: Object | string): boolean => {
    const { selectedItem } = this.state;
    if (!selectedItem) return false;

    return this.getId(selectedItem) === this.getId(item);
  };

  render() {
    const { values, component } = this.props;

    if (!component) return;

    return (
      <ul className="rta__list">
        {values.map(item =>
          <Item
            key={this.getId(item)}
            selected={this.isSelected(item)}
            item={item}
            onClickHandler={this.onPressEnter}
            onMouseEnterHandler={this.selectItem}
            component={component}
          />,
        )}
      </ul>
    );
  }
}

type dataProviderType = string =>
  | Promise<Array<Object | string>>
  | Array<Object | string>;

type Props = {
  trigger: {
    [string]: {
      output: (Object | string, string) => string,
      dataProvider: dataProviderType,
      component: React$Component<*, *, *>,
    },
  },
  loadingComponent: Function,
  onChange: SyntheticEvent => void,
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

  state: {
    currentTrigger: ?string,
    top: number,
    left: number,
    actualToken: string,
    data: ?Array<Object | string>,
    value: string,
    dataLoading: boolean,
    selectionEnd: number,
    selectionStart: number,
    component: ?React$Component<*, *, *>,
  } = {
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

  getTextToReplace = () => {
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
    this.setState({ data: null, currentTrigger: null });
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

  getCurrentTriggerSettings = () => {
    const { currentTrigger } = this.state;

    if (!currentTrigger) return null;

    return this.props.trigger[currentTrigger];
  };

  getValuesFromProvider = async () => {
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

    if (providedData instanceof Promise) {
      providedData = await dataProvider(actualToken);
    }

    if (typeof providedData !== 'object') {
      throw new Error('RTA: Trigger provider has to provide an array!');
    }

    if (typeof component !== 'function') {
      throw new Error('RTA: Component should be defined!');
    }

    this.setState({
      dataLoading: false,
      data: providedData,
      component,
    });
  };

  cleanUpProps = () => {
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

  getSuggestions = () => {
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
              <List
                values={suggestionData}
                getTextToReplace={this.getTextToReplace()}
                component={component}
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
