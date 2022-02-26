import { InputWithDropdownProps } from "./types";

export const InputWidthDropdownDefaultProps: Required<
  Pick<
    InputWithDropdownProps,
    "sortBy" | "autoCompleteOnBlur" | "languageLocal"
  >
> = {
  autoCompleteOnBlur: false,
  sortBy: "value",
  languageLocal: "fr",
};
