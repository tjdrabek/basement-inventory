"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Loader2 } from "lucide-react";

const ItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  quantity: z.number().min(1),
  toteId: z.string().min(1, "Select a tote"),
});

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [totes, setTotes] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<z.infer<typeof ItemSchema>>({
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
    async function loadTotes() {
      const res = await fetch("/api/totes");
      const data = await res.json();
      setTotes(data);
    }
    loadTotes();
  }, []);

  async function onSubmit(values: z.infer<typeof ItemSchema>) {
    setLoading(true);

    const res = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      alert("Error creating item.");
      setLoading(false);
      return;
    }

    router.push(`/tote/${values.toteId}`);
  }

  return (
    <main className="min-h-screen flex justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add an Item</CardTitle>
          <CardDescription>
            Store an item and assign it to a tote.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ski Gloves" {...field} />
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
                      <Input placeholder="Columbia" {...field} />
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
                      <Input type="number" min={1} {...field} />
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

              {/* TOTE SELECT */}
              <FormField
                control={form.control}
                name="toteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Tote</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a tote" />
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Add Item"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
