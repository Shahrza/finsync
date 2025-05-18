"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { DynamicIcon, IconName } from "lucide-react/dynamic";

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
import { categories as categoriesArr } from "@/utils/categories";
import { getHexFromTailwindClass } from "@/lib/utils";

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
  const t = useTranslations("transaction");
  const commonT = useTranslations("common");
  const categoryT = useTranslations("category");

  const { toast } = useToast();
  const router = useRouter();
  const { editingTransactionId, setEditingTransactionId } = useTransactions();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useContext(UserContext);

  const types = [
    { value: "expense", label: t("expense") },
    { value: "income", label: t("income") },
  ];

  const defaultFormValues = {
    type: TransactionType.Expense,
    category_id: "",
    amount: "",
    date: new Date().toISOString(),
    note: "",
  };

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultFormValues,
  });

  const type = form.watch("type");

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
      form.reset(defaultFormValues);
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
          title: t("update_success"),
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
      toast({ title: t("add_success"), variant: "success", duration: 2500 });
      router.refresh();
    } catch (e) {
      toast({
        title: commonT("error_occurred"),
        variant: "destructive",
        duration: 2500,
      });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = () => {
    form.setValue("category_id", "");
  };

  const categoryList = useMemo(() => {
    if (!categories?.length) return [];
    return categories
      ?.filter((value) => {
        if (value.type === type) return value;
      })
      .map(({ id, value }) => ({
        value: id,
        label: categoryT(value),
        name: value,
      }));
  }, [categories, type, categoryT]);

  const today = new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() => onOpenChange(true)}
          className="rounded-lg dark:bg-zinc-200"
        >
          <Plus />
          {t("add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {editingTransactionId ? t("edit") : t("add")}
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
                        onValueChange={(val) => {
                          handleValueChange();
                          field.onChange(val);
                        }}
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
                  label={t("amount")}
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="category_id"
                  label={t("category")}
                >
                  {categoryList.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon
                          size={20}
                          color={getHexFromTailwindClass(
                            categoriesArr[item.name].color
                          )}
                          name={categoriesArr[item.name].icon as IconName}
                        ></DynamicIcon>{" "}
                        {item.label}
                      </div>
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
                  label={commonT("date")}
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="note"
                  label={t("description")}
                />
              </div>
            </div>
            <Separator className="my-4" />
            <DialogFooter>
              <Button type="submit" size="block" loading={isLoading}>
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
