import { redirect } from "next/navigation";

import Header from "@/components/layout/Header";
import { getUser } from "@/lib/actions/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, error } = await getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-zinc-800">
      <Header fullName={data?.user?.user_metadata.fullName} />
      {children}
    </main>
  );
}
