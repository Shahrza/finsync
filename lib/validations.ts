import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().nonempty("email_required").email("email_invalid"),
  password: z
    .string()
    .nonempty("password_required")
    .min(6, "password_min_length"),
});

export const signUpSchema = z
  .object({
    fullName: z.string().nonempty("full_name_required"),
    email: z.string().nonempty("email_required").email("email_invalid"),
    password: z
      .string()
      .nonempty("password_required")
      .min(6, "password_min_length"),
    confirmPassword: z.string().nonempty("confirm_password_required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password_match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  category_id: z.string().nonempty("category_required"),
  account_type: z.string().nonempty("account_type_required"),
  amount: z
    .string()
    .nonempty("amount_required")
    .regex(/^\d+(\.\d+)?$/, "amount_invalid")
    .transform((val) => {
      const parts = val.split(".");
      if (parts.length === 2 && parts[1].length > 2) {
        return parts[0] + "." + parts[1].substring(0, 2);
      }
      return val;
    }),
  date: z.string().nonempty("date_required"),
  note: z.string().optional(),
  user_id: z.string().optional(),
});
