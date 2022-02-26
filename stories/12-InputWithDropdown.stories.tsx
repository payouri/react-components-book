import { action } from "@storybook/addon-actions";
import React from "react";

import InputWithDropdown from "../src/components/InputWithDropdown/InputWithDropdown";

export default {
  title: "Input with Dropdown",
  component: InputWithDropdown,
};

const defaultOptions = [
  {
    value: 10,
    label: "Ten",
  },
  {
    value: 9,
    label: "Nine",
  },
  {
    value: 8,
    label: "Eight",
  },
  {
    value: 7,
    label: "Seven",
  },
  {
    value: 6,
    label: "Six",
  },
  {
    value: 5,
    label: "Five",
  },
  {
    value: 4,
    label: "Four",
  },
  {
    value: 3,
    label: "Three",
  },
  {
    value: 2,
    label: "Two",
  },
  {
    value: 1,
    label: "One",
  },
];

export const Default = () => (
  <div>
    <InputWithDropdown
      onChange={action("change")}
      options={defaultOptions}
      onSubmit={action("submit")}
    />
  </div>
);
