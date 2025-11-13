import { db } from "./db";
import { items, totes } from "../db/schema";
import { like, eq } from "drizzle-orm";

export async function searchItems(query: string) {
  return db
    .select({
      itemName: items.name,
      brand: items.brand,
      quantity: items.quantity,
      toteName: totes.name,
      toteId: totes.id,
    })
    .from(items)
    .leftJoin(totes, eq(items.toteId, totes.id))
    .where(like(items.name, `%${query}%`));
}
