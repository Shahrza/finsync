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
    <main>
      <Header fullName={data?.user?.user_metadata.fullName} />
      {children}
    </main>
  );
}
