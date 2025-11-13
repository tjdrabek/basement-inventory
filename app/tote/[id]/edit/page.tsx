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
import { Loader2, ArrowLeft } from "lucide-react";

const ToteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ToteFormData = z.infer<typeof ToteSchema>;

interface EditTotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTotePage({ params }: EditTotePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toteId, setToteId] = useState<string>("");

  const form = useForm<ToteFormData>({
    resolver: zodResolver(ToteSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    async function loadTote() {
      try {
        const { id } = await params;
        setToteId(id);

        const res = await fetch(`/api/totes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch tote");
        }

        const tote = await res.json();
        form.reset({
          name: tote.name,
          description: tote.description || "",
        });
      } catch (error) {
        console.error("Error loading tote:", error);
        alert("Failed to load tote details");
        router.push("/");
      } finally {
        setInitialLoading(false);
      }
    }

    loadTote();
  }, [params, form, router]);

  async function onSubmit(values: ToteFormData) {
    setLoading(true);

    try {
      const res = await fetch(`/api/totes/${toteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update tote");
      }

      router.push(`/tote/${toteId}`);
    } catch (error) {
      console.error("Error updating tote:", error);
      alert("Failed to update tote");
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
            href={`/tote/${toteId}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tote
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Tote</CardTitle>
            <CardDescription>
              Update the name and description of this tote.
            </CardDescription>
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
                      <FormLabel>Tote Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tote name..." {...field} />
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
                          placeholder="Describe what's in this tote..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Tote
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/tote/${toteId}`)}
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
