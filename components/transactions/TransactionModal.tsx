"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/ui/custom-form-field";
import { transactionSchema } from "@/lib/validations";
import { addTransaction } from "@/lib/actions/transactions";
import { TransactionType } from "@/types";
import { SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const types = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.Expense,
      category_id: "",
      amount: "",
      date: new Date(),
      note: "",
    },
  });

  const onOpenChange = () => {
    setOpen(!open);
    form.reset();
  };

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
      onOpenChange();
      toast({ title: "Success", variant: "success", duration: 2500 });
      router.refresh();
    });
  };

  const type = form.watch("type");

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

  const today = new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 items-center mt-2">
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="type"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {types.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <Label
                              htmlFor={option.value}
                              className="cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="amount"
                  label="Amount"
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="category_id"
                  label="Category"
                >
                  {categoryList.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  disabledDate={(date: Date) => date > today}
                  name="date"
                  label="Date"
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="note"
                  label="Description"
                />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
