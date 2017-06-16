import React from 'react';
import getCaretCoordinates from 'textarea-caret';
import './style.css';
import classNames from 'classnames';

// todo Flow

const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
};

// very cool, I should open-source it, indeed
const Listeners = (function() {
  let i = 0;
  const listeners = {};

  const f = (keyCode, fn, e) => {
    const code = e.keyCode || e.which;
    if (typeof keyCode !== 'object') keyCode = [keyCode];
    if (
      keyCode.includes(code) &&
      Object.values(listeners).find(({ keyCode: triggerKeyCode }) => triggerKeyCode === keyCode)
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
  render() {
    const { component: Component, item, selected } = this.props;
    return (
      <li className={classNames('rta__item', { 'rta__item--selected': selected })} key={item}>
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
    const { values } = this.props;
    const code = e.keyCode || e.which;

    const oldPosition = this.getPositionInList();
    let newPosition;
    switch (code) {
      case KEY_CODES.DOWN: // down
        newPosition = oldPosition + 1;
        break;
      case KEY_CODES.UP: // up
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
    const { values, onSelect } = this.props;

    e.preventDefault();
    onSelect(this.getTextToReplace(values[this.getPositionInList()]));
  };

  componentDidMount() {
    const { values } = this.props;

    this.setState({
      selectedItem: values[0],
    });

    this.listeners.push(
      Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll),
      Listeners.add([KEY_CODES.ENTER], this.onPressEnter)
    );
  }

  componentWillUnmount() {
    let listener;
    while ((listener = this.listeners.pop())) Listeners.remove(listener);
  }

  getId = item => {
    return typeof item === 'object' ? item.id : item;
  };

  getTextToReplace = item => {
    return typeof item === 'object' ? item.text : item;
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
            component={component}
          />
        )}
      </ul>
    );
  }
}

class ReactTextareaAutocomplete extends React.Component {
  update = () => {
    const { trigger } = this.props;
    this.tokenRegExp = new RegExp(`[${Object.keys(trigger).join('')}]\\w*$`);
  };

  componentDidMount() {
    this.update();
    Listeners.add(KEY_CODES.ESC, this.closeAutocomplete);
  }

  componentWillUnmount() {
    Listeners.removeAll();
  }

  componentDidUpdate() {
    this.update();
  }

  state = {
    top: 0,
    left: 0,
    currentTrigger: false,
    actualToken: '',
    data: null,
    dataLoading: false,
  };

  changeHandler = e => {
    const { trigger } = this.props;

    const triggerChars = Object.keys(trigger);

    const target = e.target;
    const tokenMatch = this.tokenRegExp.exec(target.value.slice(0, target.selectionEnd));
    const lastToken = tokenMatch && tokenMatch[0];

    if (!lastToken || lastToken.length <= 1) {
      this.setState({
        data: null,
      });
    }

    const currentTrigger = (lastToken && triggerChars.find(a => a === lastToken[0])) || null;

    if (!currentTrigger) {
      return;
    }

    const { top, left } = getCaretCoordinates(target, target.selectionEnd);

    this.setState(
      {
        top,
        left,
        currentTrigger,
        actualToken: lastToken && lastToken.slice(1),
      },
      this.getValuesFromProvider
    );
  };

  modifyCurrentToken = newToken => {
    const { currentTrigger } = this.state;
    const { pair = false } = this.getCurrentTriggerSettings();

    this.textareaRef.value = this.textareaRef.value.replace(
      this.tokenRegExp,
      `${currentTrigger + newToken}${pair ? currentTrigger : ''}`
    );
    this.closeAutocomplete();
  };

  closeAutocomplete = () => {
    this.setState({ currentTrigger: null });
  };

  onSelect = newToken => {
    this.modifyCurrentToken(newToken);
    this.closeAutocomplete();
  };

  getCurrentTriggerSettings = () => this.props.trigger[this.state.currentTrigger];

  getValuesFromProvider = () => {
    const { currentTrigger, actualToken } = this.state;

    if (!currentTrigger) {
      return;
    }

    const { dataProvider, component } = this.getCurrentTriggerSettings();

    if (typeof dataProvider !== 'function') {
      console.warn('Trigger provider has to be a function!');
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

  render() {
    const { loadingComponent: Loader } = this.props;
    const { left, top, currentTrigger, data, dataLoading, component } = this.state;

    return (
      <div className={classNames('rta', { 'rta--loading': dataLoading })}>
        <textarea
          ref={ref => (this.textareaRef = ref)}
          className="rta__textarea"
          onChange={this.changeHandler}
        />
        {(dataLoading || (currentTrigger && data)) &&
          <div style={{ top, left }} className="rta__autocomplete">
            {dataLoading && <div className="rta__loader"><Loader /></div>}
            {data && <List values={data} component={component} onSelect={this.onSelect} />}
          </div>}
      </div>
    );
  }
}

export default ReactTextareaAutocomplete;
