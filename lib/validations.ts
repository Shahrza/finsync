import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    fullName: z.string().nonempty("Full name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  category_id: z.string().nonempty("Category is required"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  date: z.string().nonempty("Date is required"),
  note: z.string().optional(),
});
