export interface DropdownOptionProps<
  CustomComponentProps extends {
    label?: DropdownOptionProps["label"];
    index?: DropdownOptionProps["index"];
  } = {
    label?: string;
    index?: number;
  }
> {
  isSelected?: boolean;
  label: string;
  tabIndex?: number;
  index?: number;
  onSelect: () => void;
  onClose: () => void;
  onBackspace: () => void;
  onSearch: (s: string) => void;
  CustomComponent?:
    | string
    | ((props: CustomComponentProps, context?: any) => any)
    | (new (props: CustomComponentProps, context?: any) => any);
}

interface CustomComponentProps {
  label?: DropdownOptionProps["label"];
  index?: DropdownOptionProps["index"];
}

export interface InputWithDropdownProps<
  O extends { label: string; value: string | number } = {
    label: string;
    value: string | number;
  }
> {
  selectedOption?: O;
  autoCompleteOnBlur?: boolean;
  customOptionComponent?:
    | string
    | ((props: CustomComponentProps, context?: any) => any)
    | (new (props: CustomComponentProps, context?: any) => any);
  sortBy?: "value" | "label";
  onChange: (option?: O) => void;
  options: O[];
  onSubmit: (option?: O) => void;
  languageLocal?: string;
}

export interface InputWithDropdownState<
  O extends { label: string; value: string | number } = {
    label: string;
    value: string | number;
  }
> {
  inputValue: string;
  value?: InputWithDropdownProps<O>["options"][number];
  hasFocus: boolean;
  suggestionIndex: number;
  selectedIndex: number | undefined;
}

export type InputWithDropdownActions<
  O extends { label: string; value: string | number } = {
    label: string;
    value: string | number;
  }
> = {
  type: "updateState";
  payload: Partial<InputWithDropdownState<O>>;
};
