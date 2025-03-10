"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

import { CustomInput } from "@/components/ui/custom-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-datepicker";
import { transactionSchema } from "@/lib/validations";
import { addTransaction } from "@/lib/actions/transactions";
import { TransactionType } from "@/types";

type Category = {
  id: string;
  name: string;
  type: TransactionType;
  value: string;
  label: string;
  created_at: string;
};

type Props = {
  categories: Category[] | null;
};

const TransactionModal = ({ categories }: Props) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const types = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.Expense,
      category_id: "",
      amount: "",
      date: new Date(),
      note: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof transactionSchema>) => {
    startTransition(async () => {
      formData.amount = String(Math.abs(Number(formData.amount)));
      const { error } = await addTransaction(formData);
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          duration: 2500,
        });
        return;
      }
      setOpen(false);
      toast({ title: "Success", variant: "success", duration: 2500 });
    });
  };

  const type = watch("type");

  const categoryList = useMemo(() => {
    if (!categories?.length) return [];
    return categories
      ?.filter((value) => {
        if (value.type === type) return value;
      })
      .map(({ id, name }) => ({
        value: id,
        label: name,
      }));
  }, [categories, type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline">
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 items-center">
              <CustomSelect
                error={errors.type?.message}
                options={types}
                label="Type"
                defaultValue="expense"
                onValueChange={(value) =>
                  setValue("type", value as TransactionType)
                }
              />
            </div>
            <div className="grid grid-cols-1 items-center">
              <CustomInput
                {...register("amount")}
                error={errors.amount?.message}
                label="Amount"
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 items-center">
              <CustomSelect
                onValueChange={(value) => setValue("category_id", value)}
                error={errors.category_id?.message}
                options={categoryList}
                label="Category"
              />
            </div>
            <div className="grid grid-cols-1 items-center">
              <CustomDatePicker
                selectedDate={watch("date")}
                onSelectDate={(date) => setValue("date", date as Date)}
                error={errors.date?.message}
                label="Date"
              />
            </div>
            <div className="grid grid-cols-1 items-center">
              <CustomInput {...register("note")} label="Description" />
            </div>
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            <Button type="submit" size="block" disabled={isPending}>
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                "Save Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
