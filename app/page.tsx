"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, Package, PackagePlus, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";

interface Item {
  id: string;
  toteId: string | null;
  quantity: number;
}

interface Tote {
  id: string;
  name: string;
  description: string | null;
  createdAt: number | null;
}

interface ToteWithStats extends Tote {
  itemCount: number;
  totalQuantity: number;
}

export default function HomePage() {
  const [totes, setTotes] = useState<ToteWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTotes();
  }, []);

  const loadTotes = async () => {
    try {
      const [totesRes, itemsRes] = await Promise.all([
        fetch("/api/totes"),
        fetch("/api/items"),
      ]);

      if (!totesRes.ok || !itemsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const totesData = await totesRes.json();
      const itemsData = await itemsRes.json();

      // Calculate stats for each tote
      const toteStats = new Map();
      itemsData.forEach((item: Item) => {
        if (item.toteId) {
          if (!toteStats.has(item.toteId)) {
            toteStats.set(item.toteId, { itemCount: 0, totalQuantity: 0 });
          }
          const stats = toteStats.get(item.toteId);
          stats.itemCount++;
          stats.totalQuantity += item.quantity;
        }
      });

      // Add stats to totes and sort by item count (most items = most commonly viewed)
      const totesWithStats = totesData
        .map((tote: Tote) => ({
          ...tote,
          itemCount: toteStats.get(tote.id)?.itemCount || 0,
          totalQuantity: toteStats.get(tote.id)?.totalQuantity || 0,
        }))
        .sort(
          (a: ToteWithStats, b: ToteWithStats) => b.itemCount - a.itemCount
        );

      setTotes(totesWithStats);
    } catch (error) {
      console.error("Error loading totes:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className='min-h-screen w-full px-6 py-12 flex flex-col items-center'>
      <div className='max-w-2xl w-full space-y-12'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-bold tracking-tight'>
            Basement Inventory
          </h1>
          <p className='text-muted-foreground'>
            Track what’s in your storage totes. Quickly add totes, items, or
            search where things are stored.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar className='w-full' />

        {/* Most Common Totes */}
        {!loading && totes.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Totes</h2>
              <Button asChild variant='outline' size='sm'>
                <Link href='/totes' className='flex items-center gap-1'>
                  See All
                  <ArrowRight className='w-3 h-3' />
                </Link>
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {totes.slice(0, 3).map((tote) => (
                <Link
                  key={tote.id}
                  href={`/tote/${tote.id}`}
                  className='block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all'
                >
                  <div className='flex items-center gap-3'>
                    <Package className='w-6 h-6 text-blue-600 shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium text-gray-900 truncate'>
                        {tote.name}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {tote.itemCount}{" "}
                        {tote.itemCount === 1 ? "item" : "items"}
                        {tote.totalQuantity > 0 &&
                          ` • ${tote.totalQuantity} total qty`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && totes.length === 0 && (
          <div className='text-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
            <Boxes className='w-16 h-16 mx-auto mb-4 text-gray-400' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No totes yet
            </h3>
            <p className='text-gray-600 mb-6'>
              Get started by creating your first storage tote
            </p>
            <Button asChild size='lg'>
              <Link href='/tote/new'>
                <Boxes className='w-5 h-5 mr-2' />
                Add Your First Tote
              </Link>
            </Button>
          </div>
        )}

        {/* Separator */}
        {/* {!loading && totes.length > 0 && <hr className="border-gray-200" />} */}

        {/* Actions Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {/* View Totes */}
          {/* <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Boxes className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>View Totes</CardTitle>
              <CardDescription>
                See all your storage totes and their contents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/totes">View Totes</Link>
              </Button>
            </CardContent>
          </Card> */}

          {/* Add Tote */}
          <Card className='hover:shadow-lg transition'>
            <CardHeader>
              <Boxes className='w-8 h-8 mb-2 text-primary' />
              <CardTitle>Add a Tote</CardTitle>
              <CardDescription>
                Define a storage tote and generate its QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className='w-full'>
                <Link href='/tote/new'>Add Tote</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Add Item */}
          <Card className='hover:shadow-lg transition'>
            <CardHeader>
              <PackagePlus className='w-8 h-8 mb-2 text-primary' />
              <CardTitle>Add an Item</CardTitle>
              <CardDescription>
                Store an item and assign it to a tote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className='w-full'>
                <Link href='/item/new'>Add Item</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Search */}
          {/* <Card className="hover:shadow-lg transition">
            <CardHeader>
              <Search className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Find which tote contains a specific item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/search">Search</Link>
              </Button>
            </CardContent>
          </Card> */}

          {/* View Items */}
          <Card className='hover:shadow-lg transition'>
            <CardHeader>
              <Package className='w-8 h-8 mb-2 text-primary' />
              <CardTitle>View Items</CardTitle>
              <CardDescription>
                Browse all items in your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className='w-full' variant='secondary'>
                <Link href='/items'>View Items</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <p className='text-center text-sm text-muted-foreground pt-8'>
          Scan a tote’s QR code at any time to instantly view its contents.
        </p>
      </div>
    </main>
  );
}
