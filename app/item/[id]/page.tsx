"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Package, ArrowLeft, MapPin, Trash2, Move } from "lucide-react";

interface ItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ItemData {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  quantity: number;
  createdAt: number | null;
  toteId: string | null;
  toteName: string | null;
}

interface Tote {
  id: string;
  name: string;
}

export default function ItemPage({ params }: ItemPageProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemData | null>(null);
  const [totes, setTotes] = useState<Tote[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { id: itemId } = await params;
        setId(itemId);

        const [itemResponse, totesResponse] = await Promise.all([
          fetch(`/api/items/${itemId}`),
          fetch("/api/totes"),
        ]);

        if (!itemResponse.ok) {
          if (itemResponse.status === 404) {
            router.push("/not-found");
            return;
          }
          throw new Error("Failed to fetch item");
        }

        if (!totesResponse.ok) {
          throw new Error("Failed to fetch totes");
        }

        const [itemData, totesData] = await Promise.all([
          itemResponse.json(),
          totesResponse.json(),
        ]);

        // Enrich item data with tote name
        const enrichedItemData = {
          ...itemData,
          toteName: itemData.toteId
            ? totesData.find((tote: Tote) => tote.id === itemData.toteId)
                ?.name || null
            : null,
        };

        setItem(enrichedItemData);
        setTotes(totesData);
      } catch (error) {
        console.error("Error loading item:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params, router]);

  const handleDelete = async () => {
    if (!item) return;

    const confirmMessage = `Are you sure you want to delete "${item.name}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Redirect to tote page if item was in a tote, otherwise home
      if (item.toteId) {
        router.push(`/tote/${item.toteId}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleMove = async (newToteId: string | null) => {
    if (!item) return;

    try {
      const response = await fetch(`/api/items/${id}`, {
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

      // Reload the item data to reflect changes
      const updatedResponse = await fetch(`/api/items/${id}`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();

        // Enrich updated item data with tote name
        const enrichedUpdatedData = {
          ...updatedData,
          toteName: updatedData.toteId
            ? totes.find((tote) => tote.id === updatedData.toteId)?.name || null
            : null,
        };

        setItem(enrichedUpdatedData);
      }

      setMoveDialogOpen(false);
    } catch (error) {
      console.error("Error moving item:", error);
      alert("Failed to move item. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading item...</p>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Item not found</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const createdDate = item.createdAt
    ? new Date(item.createdAt * 1000).toLocaleDateString()
    : "Unknown";
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Item Info Card */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.name}
              </h1>

              {item.brand && (
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-medium">Brand:</span> {item.brand}
                </p>
              )}

              {item.description && (
                <p className="text-gray-600 mb-4">{item.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>ID: {item.id}</span>
                <span>Added: {createdDate}</span>
              </div>
            </div>

            {/* Quantity Badge */}
            <div className="text-center">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
                <div className="text-2xl font-bold">{item.quantity}</div>
                <div className="text-xs uppercase tracking-wide">Quantity</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/item/${id}/edit`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4" />
              Edit Item
            </Link>
            <button
              onClick={() => setMoveDialogOpen(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Move className="w-4 h-4" />
              Move Item
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete Item
            </button>
          </div>
        </div>

        {/* Location Card */}
        {item.toteId && item.toteName && (
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h2>

            <Link
              href={`/tote/${item.toteId}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{item.toteName}</h3>
                  <p className="text-sm text-gray-500">
                    Click to view tote and other items
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* If item has no tote */}
        {!item.toteId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Package className="w-5 h-5" />
              <span className="font-medium">No Location Assigned</span>
            </div>
            <p className="text-yellow-700 mt-1">
              This item is not currently assigned to any tote.
            </p>
          </div>
        )}

        {/* Move Dialog */}
        {moveDialogOpen && item && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border">
              <h3 className="text-lg font-semibold mb-4">
                Move &quot;{item.name}&quot;
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a new tote for this item:
              </p>

              <div className="space-y-3 mb-6">
                {/* Option to remove from all totes */}
                <button
                  onClick={() => handleMove(null)}
                  className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                    !item.toteId
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
                    onClick={() => handleMove(tote.id)}
                    className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                      item.toteId === tote.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{tote.name}</div>
                    {item.toteId === tote.id && (
                      <div className="text-sm text-blue-600">
                        Currently in this tote
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMoveDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
