import React from "react";
import Image from "../src/components/Image/Image";

export default {
  title: "Image",
  component: Image,
};
export const Default = () => (
  <div style={{ height: 550, width: 380, position: "relative" }}>
    <Image
      height={550}
      width={380}
      fallback={
        "https://images.unsplash.com/photo-1558507676-92c16503cd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"
      }
      alt="times"
    />
  </div>
);
