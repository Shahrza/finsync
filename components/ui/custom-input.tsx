import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: string; error?: string }
>(({ label, error, ...props }, ref) => {
  return (
    <>
      {label && <Label className="mb-2">{label}</Label>}
      <Input data-1p-ignore ref={ref} {...props} />
      {error && <span className="text-red-500 text-sm ml-3">{error}</span>}
    </>
  );
});

CustomInput.displayName = "CustomInput";

export { CustomInput };
