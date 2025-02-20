"use client";

import { signOut } from "@/lib/actions/auth";

export default function Home() {
  return (
    <>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}
