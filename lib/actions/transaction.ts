"use server";

import { withSupabase } from "@/utils/supabase/with-supabase";
import { z } from "zod";

import { transactionSchema } from "../validations";

type TransactionsQuery = {
  fromDate: string;
  toDate: string;
  ascending: boolean;
};

export const getTransactions = withSupabase(
  async (supabase, query: TransactionsQuery) => {
    const { fromDate, toDate, ascending } = query;
    const res = await supabase
      .from("transactions")
      .select(
        `id,user_id,amount,type,note,date,category:categories(name,value)`
      )
      .gte("date", fromDate)
      .lt("date", toDate)
      .order("date", { ascending });
    return res;
  }
);

export const getTransaction = withSupabase(async (supabase, id: string) => {
  const res = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  return res;
});

export const addTransaction = withSupabase(
  async (supabase, formData: z.infer<typeof transactionSchema>) => {
    const res = await supabase.from("transactions").insert([formData]);
    return res;
  }
);

export const updateTransaction = withSupabase(
  async (supabase, id: string, formData: z.infer<typeof transactionSchema>) => {
    const res = await supabase
      .from("transactions")
      .update(formData)
      .eq("id", id);
    return res;
  }
);

export const getOverviewDataByMonth = withSupabase(
  async (supabase, month: string) => {
    const res = await supabase.rpc("get_monthly_income_expense", {
      month,
    });
    return res;
  }
);

export const getOverviewDataByYear = withSupabase(
  async (supabase, year: string) => {
    const res = await supabase.rpc("get_yearly_income_expense", {
      year,
    });
    return res;
  }
);
