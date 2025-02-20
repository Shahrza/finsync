"use client";
import NextLink from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const onSubmit = async (formData: FormData) => {
    startTransition(() => login(formData));
  };

  return (
    <form action={onSubmit}>
      <Card className="w-[400px]">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl">FinSync</CardTitle>
          <CardDescription>Manage your finances efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
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
              "Login"
            )}
          </Button>
          <div className="text-sm text-muted-foreground">
            <span>Don&apos;t have an account?</span>
            {"  "}
            <NextLink href="/auth/register" className="underline">
              Register
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
