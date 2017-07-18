// @flow

import React from 'react';
import classNames from 'classnames';

import Listeners, { KEY_CODES } from './listener';
import Item from './Item';

type Props = {
  values: Array<Object | string>,
  component: ReactClass<*>,
  getTextToReplace: (Object | string) => string,
  onSelect: string => void,
};

type State = {
  selected: ?boolean,
  selectedItem: ?Object | ?string,
};

export default class List extends React.PureComponent {
  props: Props;

  listeners: Array<number> = [];

  state: State = {
    selected: null,
    selectedItem: null,
  };

  getPositionInList = () => {
    const { values } = this.props;
    const { selectedItem } = this.state;

    if (!selectedItem) return 0;

    return values.findIndex(a => this.getId(a) === this.getId(selectedItem));
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

    newPosition = (newPosition % values.length + values.length) % values.length;
    this.setState({ selectedItem: values[newPosition] });
  };

  onPressEnter = (e: SyntheticEvent) => {
    e.preventDefault();

    const { values } = this.props;

    this.modifyText(values[this.getPositionInList()]);
  };

  modifyText = (value: Object | string) => {
    if (!value) return;

    const { onSelect, getTextToReplace } = this.props;

    onSelect(getTextToReplace(value));
  };

  selectItem = (item: Object | string) => {
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
