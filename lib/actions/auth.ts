"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { signInSchema } from "@/lib/validations";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const result = signInSchema.safeParse(formData);

  if (!result.success) {
    return { error: "Form data is invalid" };
  }

  const data = {
    email: result.data.email,
    password: result.data.password,
  };

  const res = await supabase.auth.signInWithPassword(data);

  if (res?.error?.status === 400) {
    return { error: "Email or password is incorrect" };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        fullName: formData.get("fullName") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
