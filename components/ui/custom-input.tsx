import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/ui/input-error";

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: string; error?: string }
>(({ label, error, ...props }, ref) => {
  return (
    <>
      {label && <Label className="mb-2">{label}</Label>}
      <Input data-1p-ignore ref={ref} {...props} />
      <InputError error={error} />
    </>
  );
});

CustomInput.displayName = "CustomInput";

export { CustomInput };
