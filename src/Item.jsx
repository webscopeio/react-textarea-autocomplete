// @flow

import React from 'react';

import type { ItemProps } from './types';

export default class Item extends React.Component<ItemProps, *> {
  shouldComponentUpdate(nextProps: ItemProps) {
    if (
      this.props.item !== nextProps.item ||
      this.props.selected !== nextProps.selected ||
      this.props.style !== nextProps.style ||
      this.props.className !== nextProps.className
    ) {
      return true;
    }

    return false;
  }

  selectItem = () => {
    const { item, onSelectHandler } = this.props;
    onSelectHandler(item);
  };

  render() {
    const {
      component: Component,
      style,
      onClickHandler,
      item,
      selected,
      className,
      innerRef,
    } = this.props;

    return (
      <li className={`rta__item ${className || ''}`} style={style}>
        <div
          className={`rta__entity ${
            selected === true ? 'rta__entity--selected' : ''
          }`}
          role="button"
          tabIndex={0}
          onClick={onClickHandler}
          onFocus={this.selectItem}
          onMouseEnter={this.selectItem}
          onTouchStart={e => {
            this.clicked = true;
            this.selectItem(e);
          }}
          onTouchEnd={e => {
            e.preventDefault();
            if (this.clicked) {
              onClickHandler();
            }
          }}
          onTouchMove={() => {
            this.clicked = false;
          }}
          onTouchCancel={() => {
            this.clicked = false;
          }}
          /* $FlowFixMe */
          ref={innerRef}
        >
          <Component selected={selected} entity={item} />
        </div>
      </li>
    );
  }
}
