import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const allItems = await db.select().from(items).all();
    return NextResponse.json(allItems);
  } catch (err) {
    console.error("GET /api/items error:", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = randomUUID();

    await db.insert(items).values({
      id,
      name: body.name,
      description: body.description ?? null,
      brand: body.brand ?? null,
      quantity: body.quantity ?? 1,
      toteId: body.toteId,
    });

    return NextResponse.json({ id });
  } catch (err) {
    console.error("POST /api/items error:", err);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
