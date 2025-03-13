"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

import { transactionSchema } from "../validations";

export async function getTransaction(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function addTransaction(
  formData: z.infer<typeof transactionSchema>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert([formData]);
  return { data, error };
}

export async function updateTransaction(
  id: string,
  formData: z.infer<typeof transactionSchema>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(formData)
    .eq("id", id);
  return { data, error };
}
