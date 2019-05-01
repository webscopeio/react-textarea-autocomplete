// @flow

export type caretPositionType = "start" | "end" | "next" | number;

export type textToReplaceType = ?{|
  text: string,
  caretPosition: caretPositionType,
  key?: ?string
|};

export type outputType = (Object | string, ?string) => ?textToReplaceType;

export type dataProviderType = string =>
  | Promise<Array<Object | string>>
  | Array<Object | string>;

/**
 * Item Types
 */
export type ItemProps = {
  component: React$StatelessFunctionalComponent<*>,
  onSelectHandler: (Object | string) => void,
  item: Object | string,
  style: ?Object,
  className: ?string,
  onClickHandler: (SyntheticEvent<*>) => void,
  selected: boolean,
  innerRef: HTMLDivElement => mixed
};

export type ListProps = {
  values: Array<Object | string>,
  component: React$StatelessFunctionalComponent<*>,
  getTextToReplace: outputType,
  style: ?Object,
  itemStyle: ?Object,
  className: ?string,
  itemClassName: ?string,
  onSelect: textToReplaceType => void,
  dropdownScroll: HTMLDivElement => void
};

/**
 * List Types
 */
export type ListState = {
  selectedItem: ?Object | ?string
};

/**
 * Textarea Types
 */
export type settingType = {|
  component: React$StatelessFunctionalComponent<*>,
  dataProvider: dataProviderType,
  allowWhitespace?: boolean,
  afterWhitespace?: boolean,
  output?: (Object | string, ?string) => textToReplaceType | string
|};

export type triggerType = {
  [string]: settingType
};

export type TextareaProps = {
  trigger: triggerType,
  loadingComponent: React$StatelessFunctionalComponent<*>,
  textAreaComponent: {
    component: React$StatelessFunctionalComponent<*>,
    ref: "string"
  },
  onChange: ?(SyntheticEvent<*> | Event) => void,
  onSelect: ?(SyntheticEvent<*> | Event) => void,
  onBlur: ?(SyntheticEvent<*> | Event) => void,
  onCaretPositionChange: ?(number) => void,
  innerRef: ?(HTMLTextAreaElement) => void,
  scrollToItem:
    | boolean
    | ((container: HTMLDivElement, item: HTMLDivElement) => void),
  closeOnClickOutside?: boolean,
  movePopupAsYouType?: boolean,
  boundariesElement: string | HTMLElement,
  minChar: number,
  value?: string,
  style: ?Object,
  listStyle: ?Object,
  itemStyle: ?Object,
  containerStyle: ?Object,
  loaderStyle: ?Object,
  dropdownStyle: ?Object,
  className: ?string,
  containerClassName: ?string,
  listClassName: ?string,
  itemClassName: ?string,
  loaderClassName: ?string,
  dropdownClassName: ?string,
  renderToBody: ?boolean
};

export type TextareaState = {
  currentTrigger: ?string,
  top: ?number,
  left: ?number,
  actualToken: string,
  data: ?Array<Object | string>,
  value: string,
  dataLoading: boolean,
  selectionEnd: number,
  component: ?React$StatelessFunctionalComponent<*>,
  textToReplace: ?outputType
};
