import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, PackagePlus, Search } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full px-6 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Basement Inventory
          </h1>
          <p className="text-muted-foreground">
            Track what’s in your storage totes. Quickly add totes, items, or
            search where things are stored.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Tote */}
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Boxes className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Add a Tote</CardTitle>
              <CardDescription>
                Define a storage tote and generate its QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/tote/new">Add Tote</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Add Item */}
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <PackagePlus className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Add an Item</CardTitle>
              <CardDescription>
                Store an item and assign it to a tote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/item/new">Add Item</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Search className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Find which tote contains a specific item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/search">Search Items</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground pt-8">
          Scan a tote’s QR code at any time to instantly view its contents.
        </p>
      </div>
    </main>
  );
}
