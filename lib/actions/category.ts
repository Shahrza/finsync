"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");
  return { data, error };
}
