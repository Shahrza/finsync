import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  id?: string;
}

const CustomSelect = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  (
    {
      options,
      placeholder,
      className,
      containerClassName,
      label,
      onValueChange,
      value,
      defaultValue,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && (
          <Label htmlFor={id} className="mb-2 block">
            {label}
          </Label>
        )}
        <Select
          onValueChange={onValueChange}
          value={value}
          defaultValue={defaultValue}
          {...props}
        >
          <SelectTrigger className={className} ref={ref} id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
