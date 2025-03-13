"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

import { transactionSchema } from "../validations";

export async function getTransactions() {
  const supabase = await createClient();
  const res = await supabase
    .from("transactions")
    .select(`id,amount,type,note,date,category:categories(name,value)`)
    .gte("date", `2025-01-01`)
    .lt("date", "2026-01-01")
    .order("date", { ascending: false });
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
