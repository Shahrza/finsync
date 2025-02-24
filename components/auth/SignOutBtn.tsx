"use client";

import { signOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Button onClick={signOut} variant="outline" size="icon">
      <LogOut size={24} />
    </Button>
  );
}
