"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, Package, Boxes } from "lucide-react";

interface SearchResult {
  itemId: string;
  itemName: string;
  description: string | null;
  brand: string | null;
  quantity: number;
  toteId: string | null;
  toteName: string | null;
  createdAt: number | null;
}

interface ToteResult {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
}

interface ToteData {
  id: string;
  name: string;
  description: string | null;
  createdAt: number | null;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search items by name, brand, description, or search by tote name...",
  className = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemResults, setItemResults] = useState<SearchResult[]>([]);
  const [toteResults, setToteResults] = useState<ToteResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsOpen(!!query.trim());

    if (!query.trim()) {
      setItemResults([]);
      setToteResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const [itemsResponse, totesResponse] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(query)}`),
        fetch(`/api/totes`),
      ]);

      if (itemsResponse.ok) {
        const items = await itemsResponse.json();
        setItemResults(items);
      }

      if (totesResponse.ok) {
        const allTotes = await totesResponse.json();
        const filteredTotes = allTotes
          .filter(
            (tote: ToteData) =>
              tote.name.toLowerCase().includes(query.toLowerCase()) ||
              (tote.description &&
                tote.description.toLowerCase().includes(query.toLowerCase()))
          )
          .map((tote: ToteData) => ({
            ...tote,
            itemCount: 0, // We could enhance this by counting items per tote
          }));
        setToteResults(filteredTotes);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setItemResults([]);
    setToteResults([]);
    setIsOpen(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalResults = itemResults.length + toteResults.length;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              onClick={clearSearch}
              className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-6 h-6 mx-auto mb-2 animate-pulse" />
              Searching...
            </div>
          ) : totalResults > 0 ? (
            <div className="divide-y divide-gray-100">
              {/* Tote Results */}
              {toteResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                    Totes ({toteResults.length})
                  </div>
                  {toteResults.map((tote) => (
                    <Link
                      key={`tote-${tote.id}`}
                      href={`/tote/${tote.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Boxes className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {tote.name}
                          </h3>
                          {tote.description && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {tote.description}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Storage Tote
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Item Results */}
              {itemResults.length > 0 && (
                <div>
                  {toteResults.length > 0 && (
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                      Items ({itemResults.length})
                    </div>
                  )}
                  {itemResults.map((result) => (
                    <Link
                      key={`item-${result.itemId}`}
                      href={`/item/${result.itemId}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {result.itemName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {result.brand && (
                              <span className="text-blue-600 font-medium">
                                {result.brand}
                              </span>
                            )}
                            <span>Qty: {result.quantity}</span>
                            {result.toteName && (
                              <span className="text-green-600 font-medium">
                                📦 {result.toteName}
                              </span>
                            )}
                          </div>
                          {result.description && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-6 h-6 mx-auto mb-2 text-gray-300" />
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
