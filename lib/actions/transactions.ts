"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

import { transactionSchema } from "../validations";

export async function addTransaction(data: z.infer<typeof transactionSchema>) {
  const supabase = await createClient();
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert([data]);
  return { transaction, error };
}
