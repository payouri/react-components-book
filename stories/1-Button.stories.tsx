import React from "react";

import { action } from "@storybook/addon-actions";
import Button, { ButtonProps } from "../src/components/Button/Button";

export default {
  title: "Button",
  component: Button,
  parameters: {
    docs: {
      source: {
        code: "Some custom string here",
      },
    },
  },
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["purple", "blue", "yellow", "green", "red"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["sm", "md", "lg"],
      },
    },
  },
};

const Template = (props) => <Button {...props} onClick={action("clicked")} />;

export const Text = Template.bind({});
Text.args = {
  icon: "check",
  children: "Hello Button",
  size: "lg",
  color: "yellow",
} as ButtonProps;

// export const ButtonIcon = () => <Button icon={'times'} onClick={action('clicked')}>Icon Button</Button>
