// @flow

import React from 'react';

import type { PropsItem } from './types';

export default class Item extends React.Component {
  selectItem = () => {
    const { item, onSelectHandler } = this.props;
    onSelectHandler(item);
  };

  props: PropsItem;

  render() {
    const { component: Component, onClickHandler, item, selected } = this.props;

    return (
      <li className="rta__item">
        <div
          className={`rta__entity ${selected === true
            ? 'rta__entity--selected'
            : ''}`}
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
