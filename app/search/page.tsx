"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Package } from "lucide-react";

interface SearchResult {
  itemId: string;
  toteId: string;
  name: string;
  brand?: string;
  description?: string;
  toteName: string;
  quantity: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Trigger API search when debounced text changes
  useEffect(() => {
    async function search() {
      if (debounced.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/search?q=${debounced}`);
      const data = await res.json();

      setResults(data);
      setLoading(false);
    }

    search();
  }, [debounced]);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Search Items
          </h1>
        </div>

        {/* Search Input */}
        <Input
          placeholder="Search for an item name, brand, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg p-4"
        />

        {/* Loading State */}
        {loading && (
          <p className="text-muted-foreground text-center">Searching...</p>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && debounced.length > 0 && (
          <p className="text-muted-foreground text-center">
            No items found matching “{debounced}”
          </p>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((r) => (
            <Link key={r.itemId} href={`/tote/${r.toteId}`}>
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    {r.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {r.brand && (
                    <p className="text-sm text-muted-foreground">
                      Brand: {r.brand}
                    </p>
                  )}

                  {r.description && (
                    <p className="text-sm text-muted-foreground">
                      {r.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Badge>{r.toteName}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Qty: {r.quantity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
