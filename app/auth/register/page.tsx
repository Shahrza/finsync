"use client";

import NextLink from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/ui/custom-form-field";

export default function RegisterPage() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    const { isConfirmationSent, error } = await signUp(data);
    if (isConfirmationSent) {
      toast({
        title: "Please check your email to confirm your account",
        variant: "success",
        duration: 2500,
      });
      redirect("/auth/login");
    }
    if (error) {
      toast({ title: error, variant: "destructive", duration: 2500 });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[400px] shadow-2xl border-none dark:bg-zinc-900">
          <CardHeader className="text-center mb-2">
            <CardTitle className="text-2xl">FinSync</CardTitle>
            <CardDescription>Manage your finances efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fullName"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  placeholder="Create a password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 flex-col">
            <Button
              size="block"
              className="text-md font-semibold mb-4"
              type="submit"
              loading={isLoading}
            >
              Create Account
            </Button>
            <div className="text-sm text-muted-foreground">
              <span>Already have an account?</span>
              {"  "}
              <NextLink href="/auth/login" className="underline">
                Sign in
              </NextLink>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
