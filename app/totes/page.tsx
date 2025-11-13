"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  ArrowLeft,
  QrCode,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

interface Tote {
  id: string;
  name: string;
  description: string | null;
  qrCodeUrl: string | null;
  createdAt: number | null;
}

interface ToteStats {
  [toteId: string]: {
    itemCount: number;
    totalQuantity: number;
  };
}

interface Item {
  id: string;
  toteId: string | null;
  quantity: number;
}

export default function TotesPage() {
  const [totes, setTotes] = useState<Tote[]>([]);
  const [toteStats, setToteStats] = useState<ToteStats>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTotes();
  }, []);

  const loadTotes = async () => {
    try {
      const [totesRes, itemsRes] = await Promise.all([
        fetch("/api/totes"),
        fetch("/api/items"),
      ]);

      if (!totesRes.ok) {
        throw new Error(`Failed to fetch totes: ${totesRes.status} ${totesRes.statusText}`);
      }

      if (!itemsRes.ok) {
        throw new Error(`Failed to fetch items: ${itemsRes.status} ${itemsRes.statusText}`);
      }

      const totesData = await totesRes.json();
      const itemsData = await itemsRes.json();

      // Calculate stats for each tote
      const stats: ToteStats = {};
      itemsData.forEach((item: Item) => {
        if (item.toteId) {
          if (!stats[item.toteId]) {
            stats[item.toteId] = { itemCount: 0, totalQuantity: 0 };
          }
          stats[item.toteId].itemCount++;
          stats[item.toteId].totalQuantity += item.quantity;
        }
      });

      setTotes(totesData);
      setToteStats(stats);
    } catch (error) {
      console.error("Error loading totes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTotes = totes.filter(
    (tote) =>
      tote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tote.description &&
        tote.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (tote: Tote) => {
    const stats = toteStats[tote.id];
    const hasItems = stats && stats.itemCount > 0;

    const confirmMessage = hasItems
      ? `Are you sure you want to delete "${tote.name}"? This will also delete ${stats.itemCount} items inside it. This action cannot be undone.`
      : `Are you sure you want to delete "${tote.name}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/totes/${tote.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tote");
      }

      // Reload totes after deletion
      loadTotes();
    } catch (error) {
      console.error("Error deleting tote:", error);
      alert("Failed to delete tote. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading totes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <Button asChild>
            <Link href="/tote/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Tote
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Totes</h1>
          <p className="text-gray-600">
            {totes.length} {totes.length === 1 ? "tote" : "totes"} in your
            inventory
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search totes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Totes Grid */}
        {filteredTotes.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No totes found" : "No totes yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first storage tote"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/tote/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Tote
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTotes.map((tote) => {
              const stats = toteStats[tote.id] || {
                itemCount: 0,
                totalQuantity: 0,
              };
              const createdDate = tote.createdAt
                ? new Date(tote.createdAt * 1000).toLocaleDateString()
                : "Unknown";

              return (
                <Card
                  key={tote.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    {/* Tote Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {tote.name}
                        </h3>
                        {tote.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {tote.description}
                          </p>
                        )}
                      </div>

                      {/* QR Code */}
                      {tote.qrCodeUrl && (
                        <div className="shrink-0 ml-4">
                          <Image
                            src={tote.qrCodeUrl}
                            alt={`QR Code for ${tote.name}`}
                            width={60}
                            height={60}
                            className="border rounded"
                          />
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {stats.totalQuantity} items ({stats.itemCount} types)
                      </span>
                      <span>Created {createdDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/tote/${tote.id}`}>
                          <QrCode className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>

                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tote/${tote.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tote)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
