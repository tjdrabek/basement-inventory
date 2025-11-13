"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";

const ItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  toteId: z.string().min(1, "Select a tote"),
});

type ItemFormData = z.infer<typeof ItemSchema>;

interface EditItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditItemPage({ params }: EditItemPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [itemId, setItemId] = useState<string>("");
  const [totes, setTotes] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: "",
      brand: "",
      quantity: 1,
      description: "",
      toteId: "",
    },
  });

  useEffect(() => {
    async function loadItemAndTotes() {
      try {
        const { id } = await params;
        setItemId(id);

        // Load both item data and available totes
        const [itemRes, totesRes] = await Promise.all([
          fetch(`/api/items/${id}`),
          fetch("/api/totes"),
        ]);

        if (!itemRes.ok) {
          throw new Error("Failed to fetch item");
        }

        const item = await itemRes.json();
        const totesData = await totesRes.json();

        form.reset({
          name: item.name,
          brand: item.brand || "",
          quantity: item.quantity,
          description: item.description || "",
          toteId: item.toteId || "",
        });

        setTotes(totesData);
      } catch (error) {
        console.error("Error loading item:", error);
        alert("Failed to load item details");
        router.push("/");
      } finally {
        setInitialLoading(false);
      }
    }

    loadItemAndTotes();
  }, [params, form, router]);

  async function onSubmit(values: ItemFormData) {
    setLoading(true);

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      router.push(`/item/${itemId}`);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/item/${itemId}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Item
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Item</CardTitle>
            <CardDescription>Update the details of this item.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 1 : parseInt(value, 10)
                            );
                          }}
                          value={field.value || 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any notes about this item..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Tote</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tote..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {totes.map((tote) => (
                            <SelectItem key={tote.id} value={tote.id}>
                              {tote.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Item
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/item/${itemId}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
