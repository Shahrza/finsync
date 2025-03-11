"use client";

import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      size="icon"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <LogOut size={24} />}
    </Button>
  );
}
