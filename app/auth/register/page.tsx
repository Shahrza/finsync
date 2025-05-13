"use client";

import NextLink from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signUp } from "@/lib/actions/auth";
import type { SignUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/ui/custom-form-field";
import AuthCardHeader from "@/components/auth/AuthCardHeader";

export default function RegisterPage() {
  const t = useTranslations("auth");
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
    const { isConfirmationSent, error } = await signUp(data as SignUp);
    if (isConfirmationSent) {
      toast({
        title: t("confirmation_email_sent"),
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-[200px] max-w-[400px] w-[100%] m-4"
      >
        <Card className="shadow-2xl border-none dark:bg-zinc-900">
          <AuthCardHeader />
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fullName"
                  placeholder={t("full_name")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  placeholder={t("email")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  placeholder={t("create_password")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="confirmPassword"
                  placeholder={t("confirm_password")}
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
              {t("create_account")}
            </Button>
            <div className="text-sm text-muted-foreground">
              <span>{t("has_account")}</span>
              {"  "}
              <NextLink href="/auth/login" className="underline">
                {t("sign_in")}
              </NextLink>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
