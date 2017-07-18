// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  component: ReactClass<*>,
  onMouseEnterHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: SyntheticEvent => void,
  selected: boolean,
};

export default class Item extends React.Component {
  props: Props;

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
