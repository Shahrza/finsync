"use client";

import NextLink from "next/link";
import { useTransition } from "react";
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
import { CustomInput } from "@/components/ui/custom-input";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
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
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-[400px]">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl">FinSync</CardTitle>
          <CardDescription>Manage your finances efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <CustomInput
                {...register("fullName")}
                placeholder="Full name"
                error={errors.fullName?.message}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <CustomInput
                {...register("email")}
                placeholder="Email address"
                error={errors.email?.message}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <CustomInput
                {...register("password")}
                type="password"
                placeholder="Password"
                error={errors.password?.message}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <CustomInput
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 flex-col">
          <Button
            size="block"
            className="text-md font-semibold mb-4"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              "Register"
            )}
          </Button>
          <div className="text-sm text-muted-foreground">
            <span>Already have an account?</span>
            {"  "}
            <NextLink href="/auth/login" className="underline">
              Login
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
