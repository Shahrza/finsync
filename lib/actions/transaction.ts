"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

import { transactionSchema } from "../validations";

type TransactionsQuery = {
  fromDate: string;
  toDate: string;
  ascending: boolean;
};

export async function getTransactions(query: TransactionsQuery) {
  const { fromDate, toDate, ascending } = query;
  const supabase = await createClient();
  const res = await supabase
    .from("transactions")
    .select(`id,user_id,amount,type,note,date,category:categories(name,value)`)
    .gte("date", fromDate)
    .lt("date", toDate)
    .order("date", { ascending });
  return res;
}

export async function getTransaction(id: string) {
  const supabase = await createClient();
  const res = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  return res;
}

export async function addTransaction(
  formData: z.infer<typeof transactionSchema>
) {
  const supabase = await createClient();
  const res = await supabase.from("transactions").insert([formData]);
  return res;
}

export async function updateTransaction(
  id: string,
  formData: z.infer<typeof transactionSchema>
) {
  const supabase = await createClient();
  const res = await supabase.from("transactions").update(formData).eq("id", id);
  return res;
}
