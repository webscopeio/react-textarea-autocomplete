import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import ReactTextareaAutocomplete from '../src';

// eslint-disable-next-line
const SmileItemComponent = ({ entity: { label, text } }) => <div> {label} </div>;

const Loading = () => <div>Loading...</div>;

describe('object-based items', () => {
  const mockedChangeFn = jest.fn();
  const mockedSelectFn = jest.fn();
  const mockedCaretPositionChangeFn = jest.fn();

  const rtaComponent = (
    <ReactTextareaAutocomplete
      listStyle={{ background: 'pink' }}
      itemStyle={{ background: 'green' }}
      containerStyle={{ background: 'orange' }}
      loaderStyle={{ background: 'blue' }}
      className="my-rta"
      containerClassName="my-rta-container"
      listClassName="my-rta-list"
      itemClassName="my-rta-item"
      loaderClassName="my-rta-loader"
      placeholder={'Write a message.'}
      value={'Controlled text'}
      onChange={mockedChangeFn}
      onSelect={mockedSelectFn}
      onCaretPositionChange={mockedCaretPositionChangeFn}
      style={{ background: 'red' }}
      loadingComponent={Loading}
      trigger={{
        ':': {
          output: item => `___${item.text}___`,
          dataProvider: () => [
            { id: 1, label: ':)', text: 'happy_face' },
            { id: 2, label: ':(', text: 'sad_face' },
          ],
          component: SmileItemComponent,
        },
      }}
    />
  );
  const rta = mount(rtaComponent);

  it('match the snapshot', () => {
    expect(shallow(rtaComponent)).toMatchSnapshot();
  });

  it('Textarea exists', () => {
    expect(rta.find('textarea')).toHaveLength(1);
  });

  it('After the trigger was typed, it should appear list of options', () => {
    rta
      .find('textarea')
      .simulate('change', { target: { value: 'some test :a' } });
    expect(rta.find('.rta__autocomplete')).toHaveLength(1);
  });

  it('match the snapshot of dropdown, list, and item', () => {
    expect(rta.find('.rta__autocomplete').getNode()).toMatchSnapshot();
    expect(
      rta.find('.rta__autocomplete .rta__list').getNode()
    ).toMatchSnapshot();
    expect(
      rta
        .find('.rta__autocomplete .rta__list .rta__item')
        .first()
        .getNode()
    ).toMatchSnapshot();
  });

  it('should display all items', () => {
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      2
    );
  });

  it('items should be rendered within the component', () => {
    expect(
      rta
        .find('.rta__item')
        .first()
        .containsMatchingElement(<SmileItemComponent />)
    ).toEqual(true);
  });

  it('should invoke onChange handler', () => {
    expect(mockedChangeFn).toHaveBeenCalled();
  });

  it('should handle selection in textarea correctly', () => {
    rta.find('textarea').simulate('select');
    expect(mockedCaretPositionChangeFn).toHaveBeenCalled();
  });

  it('should close the autocomplete after mouse click', () => {
    const item = rta.find('.rta__entity').first();
    item.simulate('click');
    expect(rta.find('.rta__entity')).toHaveLength(0);
  });

  it('should invoke onChange handler after selection', () => {
    expect(mockedChangeFn).toHaveBeenCalledTimes(2);
  });

  it('should invoke onCaretPositionChange handler after selection', () => {
    expect(mockedCaretPositionChangeFn).toHaveBeenCalledTimes(2);
  });

  it('text in textarea should be changed', () => {
    expect(rta.find('textarea').node.value).toBe(
      '___happy_face___ some test :a'
    );
  });
});

describe('string-based items w/o output fn', () => {
  const mockedChangeFn = jest.fn();
  const mockedCaretPositionChangeFn = jest.fn();

  const rtaComponent = (
    <ReactTextareaAutocomplete
      placeholder={'Write a message.'}
      value={'Controlled text'}
      onChange={mockedChangeFn}
      onCaretPositionChange={mockedCaretPositionChangeFn}
      className={'ownClassName'}
      style={{ background: 'red' }}
      loadingComponent={Loading}
      trigger={{
        ':': {
          dataProvider: () => Promise.resolve(['happy_face', 'sad_face']),
          component: SmileItemComponent,
        },
      }}
    />
  );
  const rta = mount(rtaComponent);

  it('match match the snapshot', () => {
    expect(shallow(rtaComponent)).toMatchSnapshot();
  });

  it('Textarea exists', () => {
    expect(rta.find('textarea')).toHaveLength(1);
  });

  it('After the trigger was typed, it should appear list of options', () => {
    rta
      .find('textarea')
      .simulate('change', { target: { value: 'some test :a' } });
    expect(rta.find('.rta__autocomplete')).toHaveLength(1);
  });

  it('should display all items', () => {
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      2
    );
  });

  it('items should be rendered within the component', () => {
    expect(
      rta
        .find('.rta__item')
        .first()
        .containsMatchingElement(<SmileItemComponent />)
    ).toEqual(true);
  });

  it('should invoke onChange handler', () => {
    expect(mockedChangeFn).toHaveBeenCalled();
  });

  it('should handle selection in textarea correctly', () => {
    rta.find('textarea').simulate('select');
    expect(mockedCaretPositionChangeFn).toHaveBeenCalled();
  });

  it('should close the autocomplete after mouse click', () => {
    const item = rta.find('.rta__entity').first();
    item.simulate('click');
    expect(rta.find('.rta__entity')).toHaveLength(0);
  });

  it('should invoke onChange handler after selection', () => {
    expect(mockedChangeFn).toHaveBeenCalledTimes(2);
  });

  it('should invoke onCaretPositionChange handler after selection', () => {
    expect(mockedCaretPositionChangeFn).toHaveBeenCalledTimes(2);
  });

  it('text in textarea should be changed', () => {
    expect(rta.find('textarea').node.value).toBe(':happy_face: some test :a');
  });
});

describe('string-based items with output fn', () => {
  const mockedChangeFn = jest.fn();
  const mockedCaretPositionChangeFn = jest.fn();
  const rtaComponent = (
    <ReactTextareaAutocomplete
      placeholder={'Write a message.'}
      value={'Controlled text'}
      onChange={mockedChangeFn}
      onCaretPositionChange={mockedCaretPositionChangeFn}
      className={'ownClassName'}
      style={{ background: 'red' }}
      loadingComponent={Loading}
      trigger={{
        ':': {
          output: item => `__${item}__`,
          dataProvider: () => Promise.resolve(['happy_face', 'sad_face']),
          component: SmileItemComponent,
        },
      }}
    />
  );
  const rta = mount(rtaComponent);

  it('match match the snapshot', () => {
    expect(shallow(rtaComponent)).toMatchSnapshot();
  });

  it('Textarea exists', () => {
    expect(rta.find('textarea')).toHaveLength(1);
  });

  it('After the trigger was typed, it should appear list of options', () => {
    rta
      .find('textarea')
      .simulate('change', { target: { value: 'some test :a' } });
    expect(rta.find('.rta__autocomplete')).toHaveLength(1);
  });

  it('should display all items', () => {
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      2
    );
  });

  it('items should be rendered within the component', () => {
    expect(
      rta
        .find('.rta__item')
        .first()
        .containsMatchingElement(<SmileItemComponent />)
    ).toEqual(true);
  });

  it('should invoke onChange handler', () => {
    expect(mockedChangeFn).toHaveBeenCalled();
  });

  it('should handle selection in textarea correctly', () => {
    rta.find('textarea').simulate('select');
    expect(mockedCaretPositionChangeFn).toHaveBeenCalled();
  });

  it('should close the autocomplete after mouse click', () => {
    const item = rta.find('.rta__entity').first();
    item.simulate('click');
    expect(rta.find('.rta__entity')).toHaveLength(0);
  });

  it('should invoke onChange handler after selection', () => {
    expect(mockedChangeFn).toHaveBeenCalledTimes(2);
  });

  it('should invoke onCaretPositionChange handler after selection', () => {
    expect(mockedCaretPositionChangeFn).toHaveBeenCalledTimes(2);
  });

  it('text in textarea should be changed', () => {
    expect(rta.find('textarea').node.value).toBe('__happy_face__ some test :a');
  });
});

describe('using ref to the ReactTextareaAutocomplete to call methods', () => {
  const mockedChangeFn = jest.fn();

  const rtaComponent = (
    <ReactTextareaAutocomplete
      placeholder={'Write a message.'}
      value={'Controlled text'}
      onChange={mockedChangeFn}
      className={'ownClassName'}
      style={{ background: 'red' }}
      loadingComponent={Loading}
      trigger={{
        ':': {
          dataProvider: () => Promise.resolve(['happy_face', 'sad_face']),
          component: SmileItemComponent,
        },
      }}
    />
  );

  const rtaWrapper = mount(rtaComponent);
  const rtaWrapperRef = rtaWrapper.instance();

  it('should get the correct caret position initially', () => {
    const actual = rtaWrapperRef.getCaretPosition();
    const expected = 0;

    expect(actual).toBe(expected);
  });

  it('should set the caret position correctly', () => {
    const CARET_POSITION_TO_SET = 5;

    rtaWrapperRef.setCaretPosition(CARET_POSITION_TO_SET);

    const actual = rtaWrapperRef.getCaretPosition();
    const expected = CARET_POSITION_TO_SET;

    expect(actual).toBe(expected);
  });
});
