"use client";

import { signOut } from "@/app/auth/login/actions";

export default function Home() {
  return (
    <>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}
