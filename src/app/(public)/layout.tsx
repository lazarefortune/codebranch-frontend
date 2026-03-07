import { PublicHeader } from "@/shared/ui/public-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <PublicHeader />
      <main className="pt-16">{children}</main>
    </div>
  );
}
