// @flow

/**
 * Item Types
 */
export type ItemProps = {
  component: React$StatelessFunctionalComponent<*>,
  onSelectHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: (SyntheticEvent<*>) => void,
  selected: boolean,
};

export type ListProps = {
  values: Array<Object | string>,
  component: React$StatelessFunctionalComponent<*>,
  getTextToReplace: (Object | string) => string,
  onSelect: string => void,
};

/**
 * List Types
 */
export type ListState = {
  selectedItem: ?Object | ?string,
};

/**
 * Textarea Types
 */
type dataProviderType = string => Promise<Array<Object | string>> | Array<Object | string>;

export type settingType = {
  component: React$StatelessFunctionalComponent<*>,
  dataProvider: dataProviderType,
  output?: (Object | string, ?string) => string,
};

export type caretPositionType = 'start' | 'end' | number;

export type outputType = (
  Object | string,
  ?string,
) => string | { text: string, caretPosition: caretPositionType };

export type triggerType = {
  [string]: {|
    output?: outputType,
    dataProvider: dataProviderType,
    component: React$StatelessFunctionalComponent<*>,
  |},
};

export type TextareaProps = {
  trigger: triggerType,
  loadingComponent: React$StatelessFunctionalComponent<*>,
  onChange: ?(SyntheticEvent<*>) => void,
  onSelect: ?(SyntheticEvent<*>) => void,
  onCaretPositionChange: ?(number) => void,
  minChar: ?number,
  value?: string,
  style: ?Object,
  containerStyle: ?Object,
  className: ?string,
};

export type TextareaState = {
  currentTrigger: ?string,
  top: number,
  left: number,
  actualToken: string,
  data: ?Array<Object | string>,
  value: string,
  dataLoading: boolean,
  selectionEnd: number,
  selectionStart: number,
  component: ?React$StatelessFunctionalComponent<*>,
};
