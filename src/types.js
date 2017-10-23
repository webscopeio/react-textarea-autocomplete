// @flow

export type dataProviderType = string =>
  | Promise<Array<Object | string>>
  | Array<Object | string>;

export type settingType = {
  component: ReactClass<*>,
  dataProvider: dataProviderType,
  output?: (Object | string, ?string) => string,
};

export type getTextToReplaceType = (Object | string) => string;

export type triggerType = {
  [string]: {|
    output?: (Object | string, ?string) => string,
    dataProvider: dataProviderType,
    component: ReactClass<*>,
  |},
};

// Textarea
export type PropsTextarea = {
  trigger: triggerType,
  loadingComponent: ReactClass<*>,
  onChange?: (SyntheticEvent | Event) => void,
  minChar?: number,
  value?: string,
  style?: Object,
  containerStyle?: Object,
};

export type StateTextarea = {
  currentTrigger: ?string,
  top: number,
  left: number,
  actualToken: string,
  data: ?Array<Object | string>,
  value: string,
  dataLoading: boolean,
  selectionEnd: number,
  selectionStart: number,
  component: ?ReactClass<*>,
};

// Item
export type PropsItem = {
  component: ReactClass<*>,
  onSelectHandler: (Object | string) => void,
  item: Object | string,
  onClickHandler: SyntheticEvent => void,
  selected: boolean,
};

// List
export type PropsList = {
  values: Array<Object | string>,
  component: ReactClass<*>,
  getTextToReplace: (Object | string) => string,
  onSelect: string => void,
};

export type StateList = {
  selectedItem: ?Object | ?string,
};
