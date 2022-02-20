import React from "react";
import Input from "../src/components/Input/Input";
import { actions } from "@storybook/addon-actions";

export default {
  title: "Input",
  component: Input,
};

const Template = (props) => <Input {...props} />;

export const Default = () => (
  <div>
    <Input />
  </div>
);

export const EditableProps = Template.bind({});

EditableProps.args = actions("onSubmit", "onChange");
