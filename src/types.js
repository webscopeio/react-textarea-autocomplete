// @flow

/**
 * Item Types
 */
export type ItemProps = {
  component: React$StatelessFunctionalComponent<*>,
  onSelectHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: SyntheticEvent<*> => void,
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
type dataProviderType = string =>
  | Promise<Array<Object | string>>
  | Array<Object | string>;

export type settingType = {
  component: React$StatelessFunctionalComponent<*>,
  dataProvider: dataProviderType,
  output?: (Object | string, ?string) => string,
};

export type getTextToReplaceType = (Object | string) => string;

export type triggerType = {
  [string]: {|
    output?: (Object | string, ?string) => string,
    dataProvider: dataProviderType,
    component: React$StatelessFunctionalComponent<*>,
  |},
};

export type TextareaProps = {
  trigger: triggerType,
  loadingComponent: React$StatelessFunctionalComponent<*>,
  onChange: ?(SyntheticEvent<*> | Event) => void,
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
