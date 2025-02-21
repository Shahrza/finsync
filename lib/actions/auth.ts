"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations";

type SignIn = {
  email: string;
  password: string;
};

type SignUp = {
  fullName: string;
  email: string;
  password: string;
};

export async function signIn(formData: SignIn) {
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

export async function signUp(formData: SignUp) {
  const supabase = await createClient();

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
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
