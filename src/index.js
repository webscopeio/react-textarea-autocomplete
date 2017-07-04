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
  const listeners = {};

  const f = (keyCode, fn, e) => {
    const code = e.keyCode || e.which;
    if (typeof keyCode !== 'object') keyCode = [keyCode];
    if (
      keyCode.includes(code) &&
      Object.values(listeners).find(
        ({ keyCode: triggerKeyCode }) => triggerKeyCode === keyCode,
      )
    )
      return fn(e);
  };

  const addListener = (keyCode, fn) => {
    listeners[i] = {
      keyCode,
      fn,
    };

    document.addEventListener('keydown', e => f(keyCode, fn, e));

    return i++;
  };

  const removeListener = id => {
    delete listeners[id];
    i--;
  };

  const removeAllListeners = () => {
    document.removeEventListener('keydown', f);
  };

  return {
    add: addListener,
    remove: removeListener,
    removeAll: removeAllListeners,
  };
})();

class Item extends React.Component {
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
        <Component selected={selected} entity={item} />
      </li>
    );
  }
}

class List extends React.PureComponent {
  constructor() {
    super();
    this.listeners = [];
  }
  state = {
    selected: null,
  };

  getPositionInList = () => {
    const { values } = this.props;
    const { selectedItem } = this.state;
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

  getId = item => {
    return this.props.getTextToReplace(item);
  };

  isSelected = item => {
    const { selectedItem } = this.state;
    return this.getId(selectedItem) === this.getId(item);
  };

  render() {
    const { values, component } = this.props;

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

class ReactTextareaAutocomplete extends React.Component {
  update = prevProps => {
    const { trigger, value: newValue } = this.props;
    const { value } = this.state;
    this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}]\\w*$`);

    if (!prevProps) return;

    if (value !== newValue) {
      this.textareaRef.value = newValue;
      this.setState({ value: newValue });
    }
  };

  componentDidMount() {
    this.update(this.props);
    Listeners.add(KEY_CODES.ESC, this.closeAutocomplete);

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

  componentDidUpdate(prevProps, prevState) {
    this.update(prevProps, prevState);
  }

  state = {
    top: 0,
    left: 0,
    currentTrigger: false,
    actualToken: '',
    data: null,
    value: '',
    dataLoading: false,
  };

  changeHandler = e => {
    const { trigger, onChange } = this.props;

    if (onChange) {
      e.persist();
      onChange(e);
    }

    const triggerChars = Object.keys(trigger);

    const target = e.target;
    const tokenMatch = this.tokenRegExp.exec(
      target.value.slice(0, target.selectionEnd),
    );
    const lastToken = tokenMatch && tokenMatch[0];

    if (!lastToken || lastToken.length <= 1) {
      this.setState({
        data: null,
      });
    }

    const currentTrigger =
      (lastToken && triggerChars.find(a => a === lastToken[0])) || null;

    if (!currentTrigger) {
      return;
    }

    /* 
      JSDOM has some issue with getComputedStyles which is called by getCaretCoordinates
      so this try - catch is walk-around for Jest 
    */
    try {
      const { top, left } = getCaretCoordinates(target, target.selectionEnd);
      this.setState({ top, left });
    } catch (e) {
      console.warn(
        'RTA: failed to get caret coordinates. This is not a browser?',
      );
    }

    this.setState(
      {
        selectionEnd: target.selectionEnd,
        selectionStart: target.selectionStart,
        currentTrigger,
        actualToken: lastToken && lastToken.slice(1),
      },
      this.getValuesFromProvider,
    );
  };

  getTextToReplace = () => {
    const { output } = this.getCurrentTriggerSettings();
    const { currentTrigger } = this.state;
    return item => {
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
    this.setState({ currentTrigger: null });
  };

  onSelect = newToken => {
    const { actualToken, selectionEnd, selectionStart } = this.state;

    let offsetToEndOfToken = 0;
    const textareaValue = this.textareaRef.value;
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

    this.textareaRef.value = textareaValue.replace(textToModify, modifiedText);
    this.setTextareaCaret(newCaretPosition);

    // Hack way how to emit SyntethicEvent 'change', I'm not very satisfied with this solution.
    this.textareaRef.blur();
    this.textareaRef.focus();

    this.closeAutocomplete();
  };

  setTextareaCaret = (position = 0) => {
    this.textareaRef.selectionStart = position;
    this.textareaRef.selectionEnd = position;
  };

  getCurrentTriggerSettings = () =>
    this.props.trigger[this.state.currentTrigger];

  getValuesFromProvider = () => {
    const { currentTrigger, actualToken } = this.state;

    if (!currentTrigger) {
      return;
    }

    const { dataProvider, component } = this.getCurrentTriggerSettings();

    if (typeof dataProvider !== 'function') {
      new Error('RTA: Trigger provider has to be a function!');
    }

    this.setState({
      dataLoading: true,
      data: null,
    });

    dataProvider(actualToken).then(data => {
      this.setState({
        dataLoading: false,
        data,
        component,
      });
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
    const { left, top, currentTrigger, dataLoading, component } = this.state;

    const suggestionData = this.getSuggestions();

    return (
      <div className={classNames('rta', { 'rta--loading': dataLoading })}>
        <textarea
          ref={ref => (this.textareaRef = ref)}
          className="rta__textarea"
          onBlur={this.changeHandler}
          onChange={this.changeHandler}
          {...this.cleanUpProps(otherProps)}
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
