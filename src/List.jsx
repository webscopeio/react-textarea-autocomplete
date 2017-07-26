// @flow

import React from 'react';

import Listeners, { KEY_CODES } from './listener';
import Item from './Item';

type Props = {
  values: Array<Object | string>,
  component: ReactClass<*>,
  getTextToReplace: (Object | string) => string,
  onSelect: string => void,
};

type State = {
  selectedItem: ?Object | ?string,
};

export default class List extends React.Component {
  state: State = {
    selectedItem: null,
  };

  componentDidMount() {
    this.listeners.push(
      Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll),
      Listeners.add([KEY_CODES.ENTER, KEY_CODES.TAB], this.onPressEnter),
    );

    const { values } = this.props;
    if (values && values[0]) this.selectItem(values[0]);
  }

  componentWillReceiveProps({ values }: Props) {
    if (values && values[0]) this.selectItem(values[0]);
  }

  componentWillUnmount() {
    let listener;
    while (this.listeners.length) {
      listener = this.listeners.pop();
      Listeners.remove(listener);
    }
  }

  onPressEnter = (e: SyntheticEvent) => {
    e.preventDefault();

    const { values } = this.props;

    this.modifyText(values[this.getPositionInList()]);
  };

  getPositionInList = () => {
    const { values } = this.props;
    const { selectedItem } = this.state;

    if (!selectedItem) return 0;

    return values.findIndex(a => this.getId(a) === this.getId(selectedItem));
  };

  getId = (item: Object | string): string => this.props.getTextToReplace(item);

  props: Props;

  listeners: Array<number> = [];

  modifyText = (value: Object | string) => {
    if (!value) return;

    const { onSelect, getTextToReplace } = this.props;

    onSelect(getTextToReplace(value));
  };

  selectItem = (item: Object | string) => {
    this.setState({ selectedItem: item });
  };

  scroll = (e: KeyboardEvent) => {
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

    newPosition = (newPosition % values.length + values.length) % values.length; // eslint-disable-line
    this.setState({ selectedItem: values[newPosition] });
  };

  isSelected = (item: Object | string): boolean => {
    const { selectedItem } = this.state;
    if (!selectedItem) return false;

    return this.getId(selectedItem) === this.getId(item);
  };

  render() {
    const { values, component } = this.props;

    return (
      <ul className="rta__list">
        {values.map(item =>
          (<Item
            key={this.getId(item)}
            selected={this.isSelected(item)}
            item={item}
            onClickHandler={this.onPressEnter}
            onSelectHandler={this.selectItem}
            component={component}
          />),
        )}
      </ul>
    );
  }
}
