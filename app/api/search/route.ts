import { db } from "@/lib/db";
import { items, totes } from "@/db/schema";
import { like, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";

  const results = await db
    .select({
      itemId: items.id,
      itemName: items.name,
      brand: items.brand,
      quantity: items.quantity,
      toteId: totes.id,
      toteName: totes.name,
    })
    .from(items)
    .leftJoin(totes, eq(items.toteId, totes.id))
    .where(like(items.name, `%${q}%`));

  return NextResponse.json(results);
}
