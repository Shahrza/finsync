import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
