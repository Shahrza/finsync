export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-zinc-800">
      {children}
    </main>
  );
}
