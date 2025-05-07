"use server";

import { withSupabase } from "@/utils/supabase/with-supabase";

export const getCategories = withSupabase(async (supabase) => {
  const res = await supabase.from("categories").select("*");
  return res;
});
