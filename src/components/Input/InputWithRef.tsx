import React from "react";
import Input from "./Input";

const InputWithRef = React.forwardRef<Input>((props, ref) => (
  <Input {...props} ref={ref} />
));
InputWithRef.displayName = "InputWithRef";

export default InputWithRef;
