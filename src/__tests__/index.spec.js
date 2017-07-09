import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactTextareaAutocomplete from './../index';

const wait = (time = 0) => new Promise(res => setTimeout(() => res(), time));

const SmileItemComponent = ({ entity: { label, text } }) =>
  <div style={{ background: 'pink' }}>
    {label}
  </div>;

const Loading = () => <div>Loading...</div>;

const mockedFn = jest.fn();

const rtaComponent = (
  <ReactTextareaAutocomplete
    placeholder={'Write a message.'}
    value={'Controlled text'}
    onChange={mockedFn}
    className={'ownClassName'}
    style={{ background: 'red' }}
    loadingComponent={Loading}
    trigger={{
      ':': {
        output: (item, trigger) => `___${item.text}___`,
        dataProvider: token => [
          { id: 1, label: ':)', text: 'happy_face' },
          { id: 2, label: ':(', text: 'sad_face' },
        ],
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

it('After the trigger was typed, it should appear list of options', async () => {
  rta
    .find('textarea')
    .simulate('change', { target: { value: 'some test :a' } });
  expect(rta.find('.rta__autocomplete')).toHaveLength(1);
});

it('should display all items', () => {
  expect(rta.find('.rta__autocomplete .rta__list .rta__item')).toHaveLength(2);
});

it('items should be rendered within the component', () => {
  expect(
    rta
      .find('.rta__item')
      .first()
      .containsMatchingElement(<SmileItemComponent />),
  ).toEqual(true);
});

it('should invoke onchange handler', () => {
  expect(mockedFn).toHaveBeenCalled();
});

it('should close the autocomplete after mouse click', () => {
  const item = rta.find('.rta__item').first();
  item.simulate('click');
  expect(rta.find('.rta__item')).toHaveLength(0);
});

it('text in textarea should be changed', () => {
  expect(rta.find('textarea').node.value).toBe('___happy_face___some test :a');
});
