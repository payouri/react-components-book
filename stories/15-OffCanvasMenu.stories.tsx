import React from "react";
import OffCanvasMenu from "../src/components/OffCanvasMenu/OffCanvasMenu";

export default {
  title: "OffCanvas Menu",
  component: OffCanvasMenu,
};

export const Left = (): JSX.Element => <OffCanvasMenu />;
export const Right = (): JSX.Element => <OffCanvasMenu side="right" />;
