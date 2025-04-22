"use client";

import { createContext, ReactNode } from "react";

export interface User {
  id?: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmation_sent_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    email?: string;
    email_verified?: boolean;
    fullName?: string;
    phone_verified?: boolean;
    sub?: string;
  };
  identities?: {
    id?: string;
    email?: string;
  }[];
  created_at?: string;
  updated_at?: string;
  is_anonymous?: boolean;
}

export const UserContext = createContext<User | null>(null);

export default function UserContextProvider({
  value,
  children,
}: {
  value: User | null;
  children: ReactNode;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
