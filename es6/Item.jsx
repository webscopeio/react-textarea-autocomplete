// @flow

import React from 'react';

type Props = {
  component: React$StatelessFunctionalComponent<*>,
  onSelectHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: SyntheticEvent<*> => void,
  selected: boolean,
};

export default class Item extends React.Component<Props, *> {
  selectItem = () => {
    const { item, onSelectHandler } = this.props;
    onSelectHandler(item);
  };

  props: Props;

  render() {
    const { component: Component, onClickHandler, item, selected } = this.props;

    return (
      <li className="rta__item">
        <div
          className={`rta__entity ${selected === true ? 'rta__entity--selected' : ''}`}
          role="button"
          tabIndex={0}
          onClick={onClickHandler}
          onFocus={this.selectItem}
          onMouseEnter={this.selectItem}
        >
          <Component selected={selected} entity={item} />
        </div>
      </li>
    );
  }
}
