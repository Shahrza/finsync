import * as React from "react";
import { Label } from "./label";

import { cn } from "@/lib/utils";

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: string; error?: string }
>(({ className, type, label, error, ...props }, ref) => {
  return (
    <>
      {label && <Label>{label}</Label>}
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        data-1p-ignore
        {...props}
      />
      {error && <span className="text-red-500 text-sm ml-3">{error}</span>}
    </>
  );
});

CustomInput.displayName = "CustomInput";

export { CustomInput };
