"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Pencil,
  Plus,
  Package,
  ArrowLeft,
  Trash2,
  Printer,
} from "lucide-react";

interface TotePageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Tote {
  id: string;
  name: string;
  description: string | null;
  qrCodeUrl: string | null;
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  quantity: number;
  toteId: string | null;
}

export default function TotePage({ params }: TotePageProps) {
  const router = useRouter();
  const [tote, setTote] = useState<Tote | null>(null);
  const [toteItems, setToteItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const { id: toteId } = await params;
        setId(toteId);

        const response = await fetch(`/api/totes/${toteId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/not-found");
            return;
          }
          throw new Error("Failed to fetch tote");
        }

        const data = await response.json();
        setTote({
          id: data.id,
          name: data.name,
          description: data.description,
          qrCodeUrl: data.qrCodeUrl,
        });
        setToteItems(data.items || []);
      } catch (error) {
        console.error("Error loading tote:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params, router]);

  const handleDelete = async () => {
    if (!tote) return;

    const hasItems = toteItems.length > 0;
    const confirmMessage = hasItems
      ? `Are you sure you want to delete "${tote.name}"? This will also delete ${toteItems.length} items inside it. This action cannot be undone.`
      : `Are you sure you want to delete "${tote.name}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/totes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tote");
      }

      router.push("/");
    } catch (error) {
      console.error("Error deleting tote:", error);
      alert("Failed to delete tote. Please try again.");
    }
  };

  const handlePrintLabel = () => {
    if (!tote || !tote.qrCodeUrl) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=600,height=400");
    if (!printWindow) return;

    // Generate printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Label - ${tote.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: white;
            }
            .label {
              text-align: center;
              border: 2px dashed #ccc;
              padding: 30px;
              border-radius: 10px;
              background: white;
            }
            .tote-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
              word-wrap: break-word;
              max-width: 300px;
            }
            .qr-code {
              margin: 0 auto 20px;
            }
            .instructions {
              font-size: 12px;
              color: #666;
              margin-top: 15px;
              font-style: italic;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .label { border: 2px solid #333; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="tote-name">${tote.name}</div>
            <div class="qr-code">
              <img src="${tote.qrCodeUrl}" alt="QR Code" width="150" height="150" />
            </div>
            <div class="instructions">Scan to view tote contents</div>
          </div>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Label</button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Auto-focus the print window
    printWindow.focus();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading tote...</p>
        </div>
      </main>
    );
  }

  if (!tote) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tote not found</p>
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

  const totalItems = toteItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
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

        {/* Tote Info Card */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tote.name}</h1>
              <p className="text-gray-600 mt-2">{tote.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {totalItems} items total
                </span>
                <span>ID: {tote.id}</span>
              </div>
            </div>

            {/* QR Code */}
            {tote.qrCodeUrl && (
              <div className="text-center">
                <Image
                  src={tote.qrCodeUrl}
                  alt={`QR Code for ${tote.name}`}
                  width={120}
                  height={120}
                  className="border rounded"
                />
                <p className="text-xs text-gray-500 mt-2">Scan to view</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/tote/${id}/edit`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4" />
              Edit Tote
            </Link>
            <Link
              href={`/item/new?toteId=${id}`}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Link>
            {tote.qrCodeUrl && (
              <button
                onClick={handlePrintLabel}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                <Printer className="w-4 h-4" />
                Print Label
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete Tote
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-xl font-semibold mb-4">Items in this Tote</h2>

          {toteItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No items in this tote yet.</p>
              <Link
                href={`/item/new?toteId=${id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Add the first item
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {toteItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.brand && (
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
