"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { CustomInput } from "@/components/ui/custom-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";

const supabase = createClient();

type Category = {
  value: string;
  label: string;
};

const TransactionModal = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const types = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  const handleTypeChange = (value: string) => {
    console.log("Selected type:", value);
  };

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data, error } = await supabase.from("categories").select("*");
    if (!data || error) return;
    setCategories(
      data.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <Separator className="my-2" />
        <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center">
            <CustomSelect
              options={types}
              label="Type"
              defaultValue="expense"
              onValueChange={handleTypeChange}
            />
          </div>
          <div className="grid grid-cols-1 items-center">
            <CustomInput label="Amount" type="number" />
          </div>
          <div className="grid grid-cols-1 items-center">
            <CustomSelect options={categories} label="Category" />
          </div>
          <div className="grid grid-cols-1 items-center">
            <CustomInput label="Description" />
          </div>
          <div className="grid grid-cols-1 items-center">
            <CustomDatePicker label="Date" />
          </div>
        </div>
        <Separator className="my-2" />
        <DialogFooter>
          <Button type="submit" size="block">
            Save Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
