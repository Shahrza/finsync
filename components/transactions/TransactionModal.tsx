"use client";

import { useContext, useEffect, useMemo, useState } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/ui/custom-form-field";
import { transactionSchema } from "@/lib/validations";
import {
  getTransaction,
  addTransaction,
  updateTransaction,
} from "@/lib/actions/transaction";
import { TransactionType } from "@/types";
import { SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useTransactions from "@/store/useTransactions";
import { UserContext } from "@/context/userContext";

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
  const { editingTransactionId, setEditingTransactionId } = useTransactions();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useContext(UserContext);

  const types = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.Expense,
      category_id: "",
      amount: "",
      date: new Date().toISOString(),
      note: "",
    },
  });

  useEffect(() => {
    if (!editingTransactionId) return;
    (async () => {
      const { data } = await getTransaction(editingTransactionId);
      data.amount = String(data.amount);
      form.reset(data);
      setOpen(true);
    })();
  }, [editingTransactionId, form]);

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingTransactionId("");
      form.reset({
        type: TransactionType.Expense,
        category_id: "",
        amount: "",
        date: new Date().toISOString(),
        note: "",
      });
    }
  };

  const onSubmit = async (formData: z.infer<typeof transactionSchema>) => {
    setIsLoading(true);
    try {
      const user_id = user?.id;
      formData.user_id = user_id;
      formData.amount = String(Math.abs(Number(formData.amount)));
      if (editingTransactionId) {
        const { error } = await updateTransaction(editingTransactionId, {
          ...formData,
        });
        if (error) {
          throw error;
        }
        onOpenChange(false);
        toast({
          title: "Transaction updated",
          variant: "success",
          duration: 2500,
        });
        router.refresh();
        return;
      }
      const { error } = await addTransaction(formData);
      if (error) {
        throw error;
      }
      onOpenChange(false);
      toast({ title: "Transaction added", variant: "success", duration: 2500 });
      router.refresh();
    } catch (e) {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2500,
      });
      throw e;
    } finally {
      setIsLoading(false);
    }
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
        <Button
          onClick={() => onOpenChange(true)}
          className="rounded-lg dark:bg-zinc-200"
        >
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {editingTransactionId ? "Edit" : "New"} Transaction
          </DialogTitle>
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
                  type="number"
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
              <Button type="submit" size="block" loading={isLoading}>
                Save Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
