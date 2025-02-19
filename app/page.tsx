import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SignOutBtn from "@/components/auth/SignOutBtn";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <>
      <p>Hello {data.user.user_metadata.fullName}</p>
      <SignOutBtn />
    </>
  );
}
