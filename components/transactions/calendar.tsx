"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  setMonth,
  getMonth,
  startOfMonth,
} from "date-fns";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewingMonth, setViewingMonth] = useState(startOfMonth(new Date()));
  const [showMonthSelect, setShowMonthSelect] = useState(false);

  const setSearchParams = (newMonth: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fromDate", format(newMonth, "yyyy-MM-dd"));
    params.set(
      "toDate",
      format(startOfMonth(addMonths(newMonth, 1)), "yyyy-MM-dd")
    );
    router.push(`?${params.toString()}`);
  };

  const goToPrevMonth = () => {
    const newMonth = subMonths(viewingMonth, 1);
    setSearchParams(newMonth);
    setViewingMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = addMonths(viewingMonth, 1);
    setSearchParams(newMonth);
    setViewingMonth(newMonth);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newMonth = setMonth(viewingMonth, monthIndex);
    setViewingMonth(newMonth);
    setSearchParams(newMonth);
    setShowMonthSelect(false);
  };

  const toggleMonthSelect = () => setShowMonthSelect((prev) => !prev);

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Popover open={showMonthSelect} onOpenChange={setShowMonthSelect}>
        <PopoverTrigger asChild>
          <Button
            className="w-40"
            variant="outline"
            onClick={toggleMonthSelect}
          >
            {format(viewingMonth, "MMMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="grid grid-cols-3 gap-2 w-64">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={index === getMonth(viewingMonth) ? "default" : "ghost"}
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" onClick={goToNextMonth}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
