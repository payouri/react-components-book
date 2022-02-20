import { actions } from "@storybook/addon-actions";
import React from "react";

// import { action } from '@storybook/addon-actions'
import HandSign from "../src/components/HandSign/HandSign";

export default {
  title: "DrawArea",
  component: HandSign,
};

export const Default = () => (
  <HandSign
    onValidateSignature={(signatureData) => {
      actions(signatureData);
    }}
  />
);
