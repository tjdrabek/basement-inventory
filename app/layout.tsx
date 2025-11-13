import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";

export const metadata = {
  title: "Basement Inventory",
  description: "Track items in storage totes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* NAVBAR */}
        <header className="border-b bg-card">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Left side brand / home link */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-xl hover:opacity-80 transition"
            >
              <PackageSearch className="w-6 h-6 text-primary" />
              Basement Inventory
            </Link>

            {/* Right side nav (optional extra links) */}
            <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/tote/new">New Tote</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/item/new">New Item</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/search">Search</Link>
              </Button>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
