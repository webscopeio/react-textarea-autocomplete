import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import ReactTextareaAutocomplete from '../src';
import Item from '../src/Item';

// eslint-disable-next-line
const SmileItemComponent = ({ entity: { label, text } }) => (
  <div> {label} </div>
);

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
    // RTA is by default async (there is loader)
    rta.update();
    expect(rta.find('.rta__autocomplete').instance()).toMatchSnapshot();
    expect(rta.find('ul').instance()).toMatchSnapshot();
    expect(
      rta
        .find('.rta__autocomplete .rta__list .rta__item')
        .first()
        .instance()
    ).toMatchSnapshot();
  });

  it('should display all items', () => {
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      2
    );
  });

  it('should use the create a key from the output function if no key is provided', () => {
    const items = rta.find(Item);
    expect(items.at(0).key()).toEqual('___happy_face___');
    expect(items.at(1).key()).toEqual('___sad_face___');
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
    expect(rta.find('textarea').instance().value).toBe('___happy_face___ ');
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
    rta.update();
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
    expect(rta.find('textarea').instance().value).toBe(':happy_face: ');
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
    rta.update();
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
    expect(rta.find('textarea').instance().value).toBe('__happy_face__ ');
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

describe('object-based items with keys', () => {
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
            { key: '1', label: ':)', text: 'happy_face' },
            { key: 'some id', label: ':(', text: 'sad_face' },
            { key: 3, label: ':|', text: 'sad_face' },
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
    rta.update();
    expect(rta.find('.rta__autocomplete').instance()).toMatchSnapshot();
    expect(
      rta.find('.rta__autocomplete .rta__list').instance()
    ).toMatchSnapshot();
    expect(
      rta
        .find('.rta__autocomplete .rta__list .rta__item')
        .first()
        .instance()
    ).toMatchSnapshot();
  });

  it('should display all items', () => {
    rta.update();
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      3
    );
  });

  it('should use the key property from the data obejct', () => {
    const items = rta.find(Item);
    expect(items.at(0).key()).toEqual('1');
    expect(items.at(1).key()).toEqual('some id');
    expect(items.at(2).key()).toEqual('3');
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
    expect(rta.find('textarea').instance().value).toBe('___happy_face___ ');
  });
});

describe('object-based items without keys and custom unique generator', () => {
  const mockedChangeFn = jest.fn();
  const mockedSelectFn = jest.fn();
  const mockedCaretPositionChangeFn = jest.fn();

  const rtaComponent = (
    <ReactTextareaAutocomplete
      placeholder={'Write a message.'}
      value={'Controlled text'}
      onChange={mockedChangeFn}
      onSelect={mockedSelectFn}
      onCaretPositionChange={mockedCaretPositionChangeFn}
      loadingComponent={Loading}
      trigger={{
        ':': {
          output: item => ({
            key: 10 + item.value,
            text: `___${item.text}___`,
            caretPosition: 'next',
          }),
          dataProvider: () => [
            { value: 1, label: ':)', text: 'happy_face' },
            { value: 2, label: ':(', text: 'sad_face' },
            { value: 3, label: ':|', text: 'sad_face' },
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

  it('After the trigger was typed, it should appear list of options', () => {
    rta
      .find('textarea')
      .simulate('change', { target: { value: 'some test :a' } });
    expect(rta.find('.rta__autocomplete')).toHaveLength(1);
  });

  it('should display all items', () => {
    rta.update();
    expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(
      3
    );
  });

  it('should generate unique value by the output generator', () => {
    const items = rta.find(Item);
    expect(items.at(0).key()).toEqual('11');
    expect(items.at(1).key()).toEqual('12');
    expect(items.at(2).key()).toEqual('13');
  });
});
