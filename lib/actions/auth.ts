"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { withSupabase } from "@/utils/supabase/with-supabase";
import { signInSchema, signUpSchema } from "@/lib/validations";

export type SignIn = {
  email: string;
  password: string;
};

export type SignUp = {
  fullName: string;
  email: string;
  password: string;
};

export const signIn = withSupabase(async (supabase, formData: SignIn) => {
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
});

export const signUp = withSupabase(async (supabase, formData: SignUp) => {
  const result = signUpSchema.safeParse(formData);

  if (!result.success) {
    return { error: "Form data is invalid" };
  }

  const data = {
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        fullName: result.data.fullName,
      },
    },
  };

  const { error, data: resData } = await supabase.auth.signUp(data);

  if (resData.user) {
    return { isConfirmationSent: true };
  }

  if (error) {
    return { error: "Something went wrong" };
  }

  revalidatePath("/", "layout");
  redirect("/");
});

export const signOut = withSupabase(async (supabase) => {
  await supabase.auth.signOut();
  redirect("/auth/login");
});

export const getUser = withSupabase(async (supabase) => {
  const res = await supabase.auth.getUser();
  return res;
});
