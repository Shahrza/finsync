"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import useTransactions from "@/store/useTransactions";

type Props = {
  id: string;
};

export const TransactionDropdownMenu = ({ id }: Props) => {
  const t = useTranslations("transaction");
  const errorT = useTranslations("error");
  const commonT = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setEditingTransactionId } = useTransactions();

  async function handleEdit(id: string) {
    setEditingTransactionId(id);
  }

  async function handleDelete() {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      if (error) {
        toast({
          title: errorT("error_occurred"),
          variant: "destructive",
        });
        throw error;
      }
      setOpen(false);
      toast({
        title: t("delete_success"),
        variant: "success",
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer p-2 rounded-full hover:bg-neutral-100">
            <EllipsisVertical size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleEdit(id)}>
              {t("edit")}
              <DropdownMenuShortcut>
                <Pencil size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-red-600 focus:bg-red-500 focus:text-white"
            >
              {t("delete")}
              <DropdownMenuShortcut>
                <Trash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">{t("delete")}</DialogTitle>
          <DialogDescription>{t("confirm_delete")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} disabled={isLoading}>
            {commonT("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            type="submit"
            loading={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 mb-2 md:mb-0"
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
