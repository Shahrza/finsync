"use client";

import { Check, Languages, Loader2 } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useTransition } from "react";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { Button } from "../ui/button";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger aria-label={label} asChild>
          <Button
            variant="outline"
            size="icon"
            className="dark:border-stone-400"
          >
            {isPending ? (
              <Loader2 className="animate-spin dark:text-white" />
            ) : (
              <Languages className="h-[1.2rem] w-[1.2rem] text-slate-600 transition-colors group-hover:text-slate-900 dark:text-white" />
            )}
          </Button>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="end"
            className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md"
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
                  value={item.value}
                >
                  <div className="mr-2 w-[1rem]">
                    {item.value === defaultValue && (
                      <Check className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <span className="text-slate-900">{item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white text-white" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
