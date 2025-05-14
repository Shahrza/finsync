import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-68px)] w-full dark:bg-zinc-800 bg-gray-100 overflow-hidden">
      {children}
    </div>
  );
}
