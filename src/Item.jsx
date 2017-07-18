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
  onMouseEnterHandler = () => {
    const { item, onMouseEnterHandler } = this.props;
    onMouseEnterHandler(item);
  };

  props: Props;

  render() {
    const { component: Component, onClickHandler, item, selected } = this.props;

    return (
      <li className={classNames('rta__item', { 'rta__item--selected': selected })}>
        <button onClick={onClickHandler} onMouseEnter={this.onMouseEnterHandler}>
          <Component selected={selected} entity={item} />
        </button>
      </li>
    );
  }
}
