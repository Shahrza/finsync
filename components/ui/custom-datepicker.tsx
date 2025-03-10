"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import InputError from "@/components/ui/input-error";

export interface CustomDatePickerProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  calendarClassName?: string;
  id?: string;
  disabled?: boolean;
  error?: string;
}

const CustomDatePicker = React.forwardRef<
  HTMLButtonElement,
  CustomDatePickerProps
>(
  (
    {
      selectedDate,
      onSelectDate,
      placeholder = "Pick a date",
      label,
      className,
      buttonClassName,
      popoverClassName,
      calendarClassName,
      id,
      disabled,
      error,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                buttonClassName
              )}
              disabled={disabled}
              ref={ref}
              id={id}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd.MM.yyyy")
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("w-auto p-0", popoverClassName)}
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onSelectDate?.(date);
                setOpen(false);
              }}
              initialFocus
              className={calendarClassName}
              disabled={disabled}
              {...props}
            />
          </PopoverContent>
        </Popover>
        <InputError error={error} />
      </div>
    );
  }
);

CustomDatePicker.displayName = "CustomDatePicker";

export { CustomDatePicker };
