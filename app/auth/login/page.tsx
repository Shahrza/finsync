"use client";

import NextLink from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/ui/custom-form-field";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signIn } from "@/lib/actions/auth";
import type { SignIn } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import AuthCardHeader from "@/components/auth/AuthCardHeader";

export default function LoginPage() {
  const t = useTranslations("auth");
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const { error } = await signIn(data as SignIn);
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
                  name="email"
                  placeholder={t("email")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <CustomFormField
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  placeholder={t("password")}
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
              {t("sign_in")}
            </Button>
            <div className="text-sm text-muted-foreground">
              <span>{t("no_account")} </span>
              {"  "}
              <NextLink href="/auth/register" className="underline">
                {t("register")}
              </NextLink>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
