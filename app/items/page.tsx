"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Move,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  quantity: number;
  toteId: string | null;
  createdAt: number | null;
}

interface ItemWithTote extends Item {
  toteName?: string;
}

interface Tote {
  id: string;
  name: string;
}

const ITEMS_PER_PAGE = 12;

export default function ItemsPage() {
  const [items, setItems] = useState<ItemWithTote[]>([]);
  const [totes, setTotes] = useState<Tote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moveDialog, setMoveDialog] = useState<{
    item: ItemWithTote | null;
    isOpen: boolean;
  }>({ item: null, isOpen: false });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const [itemsRes, totesRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/totes"),
      ]);

      if (!itemsRes.ok) {
        throw new Error(
          `Failed to fetch items: ${itemsRes.status} ${itemsRes.statusText}`
        );
      }

      if (!totesRes.ok) {
        throw new Error(
          `Failed to fetch totes: ${totesRes.status} ${totesRes.statusText}`
        );
      }

      const itemsData = await itemsRes.json();
      const totesData = await totesRes.json();

      // Map tote names to items
      const toteMap = new Map(
        totesData.map((tote: Tote) => [tote.id, tote.name])
      );
      const itemsWithTotes = itemsData.map((item: Item) => ({
        ...item,
        toteName: item.toteId ? toteMap.get(item.toteId) : undefined,
      }));

      setItems(itemsWithTotes);
      setTotes(totesData);

      // Debug: Log items with brands
      const itemsWithBrands = itemsWithTotes.filter((item: Item) => item.brand);
      console.log(
        `Loaded ${itemsWithTotes.length} items, ${itemsWithBrands.length} have brands:`,
        itemsWithBrands.map((item: Item) => ({
          name: item.name,
          brand: item.brand,
        }))
      );
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items
    .filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const brandMatch =
        item.brand && item.brand.toLowerCase().includes(searchLower);
      const descMatch =
        item.description &&
        item.description.toLowerCase().includes(searchLower);
      const toteMatch =
        item.toteName && item.toteName.toLowerCase().includes(searchLower);

      // Enhanced debug logging when searching
      if (searchQuery) {
        console.log(`Searching "${searchQuery}" against item:`, {
          name: item.name,
          brand: item.brand,
          description: item.description,
          toteName: item.toteName,
          matches: { nameMatch, brandMatch, descMatch, toteMatch },
        });
      }

      return nameMatch || brandMatch || descMatch || toteMatch;
    })
    .sort((a, b) => {
      // Group unbinned items (no toteId) first
      if (!a.toteId && b.toteId) return -1;
      if (a.toteId && !b.toteId) return 1;

      // Within same group, sort by name
      return a.name.localeCompare(b.name);
    });

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: ItemWithTote) => {
    const confirmMessage = `Are you sure you want to delete "${item.name}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Reload items after deletion
      loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleMove = async (item: ItemWithTote, newToteId: string | null) => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          toteId: newToteId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to move item");
      }

      // Reload items after move
      loadItems();
      setMoveDialog({ item: null, isOpen: false });
    } catch (error) {
      console.error("Error moving item:", error);
      alert("Failed to move item. Please try again.");
    }
  };

  const openMoveDialog = (item: ItemWithTote) => {
    setMoveDialog({ item, isOpen: true });
  };

  const closeMoveDialog = () => {
    setMoveDialog({ item: null, isOpen: false });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading items...</p>
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
            <Link href="/item/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Items</h1>
          <p className="text-gray-600">
            {searchQuery ? (
              <>
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"} found
                {filteredItems.length < items.length && (
                  <span> (of {items.length} total)</span>
                )}
              </>
            ) : (
              <>
                {items.length} {items.length === 1 ? "item" : "items"} in your
                inventory
              </>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by name, brand, description, or tote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No items found" : "No items yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by adding your first item"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/item/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((item, index) => {
                // Check if we need to insert section headers
                const isFirstItem = index === 0;
                const prevItem = index > 0 ? paginatedItems[index - 1] : null;
                const needsSectionHeader =
                  isFirstItem ||
                  (prevItem && !prevItem.toteId !== !item.toteId);

                const createdDate = item.createdAt
                  ? new Date(item.createdAt * 1000).toLocaleDateString()
                  : "Unknown";

                return (
                  <div key={item.id} className="contents">
                    {/* Section header for unbinned vs binned items */}
                    {needsSectionHeader && (
                      <div className="col-span-full mb-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-3">
                          {!item.toteId ? "Unassigned Items" : "Items in Totes"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {!item.toteId
                            ? "Items that haven't been assigned to a tote yet"
                            : "Items organized in totes"}
                        </p>
                      </div>
                    )}

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {/* Item Header */}
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.name}
                          </h3>
                          {item.brand && (
                            <p className="text-sm font-medium text-blue-600 mb-1">
                              {item.brand}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Quantity & Location */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs text-gray-500">
                              Added {createdDate}
                            </span>
                          </div>

                          {item.toteId && item.toteName ? (
                            <div className="mt-2">
                              <Link
                                href={`/tote/${item.toteId}`}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <MapPin className="w-3 h-3" />
                                {item.toteName}
                              </Link>
                            </div>
                          ) : (
                            <div className="mt-2 text-xs text-gray-500">
                              Not assigned to a tote
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link href={`/item/${item.id}`}>
                              <Package className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>

                          <Button asChild size="sm" variant="outline">
                            <Link href={`/item/${item.id}/edit`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMoveDialog(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Move className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredItems.length)} of{" "}
                  {filteredItems.length} items
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div
                            key={page}
                            className="flex items-center space-x-1"
                          >
                            {showEllipsis && (
                              <span className="px-2 py-1 text-gray-500">
                                ...
                              </span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Move Dialog */}
        {moveDialog.isOpen && moveDialog.item && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border">
              <h3 className="text-lg font-semibold mb-4">
                Move &quot;{moveDialog.item.name}&quot;
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a new tote for this item:
              </p>

              <div className="space-y-3 mb-6">
                {/* Option to remove from all totes */}
                <button
                  onClick={() => handleMove(moveDialog.item!, null)}
                  className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                    !moveDialog.item.toteId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="font-medium">No Tote</div>
                  <div className="text-sm text-gray-500">
                    Remove from all totes
                  </div>
                </button>

                {/* List of available totes */}
                {totes.map((tote) => (
                  <button
                    key={tote.id}
                    onClick={() => handleMove(moveDialog.item!, tote.id)}
                    className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                      moveDialog.item?.toteId === tote.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{tote.name}</div>
                    {moveDialog.item?.toteId === tote.id && (
                      <div className="text-sm text-blue-600">
                        Currently in this tote
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={closeMoveDialog}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
