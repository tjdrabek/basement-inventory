import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const row = await db
      .select()
      .from(items)
      .where(eq(items.id, params.id))
      .limit(1);

    if (row.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(row[0]);
  } catch (err) {
    console.error("GET item error:", err);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    await db
      .update(items)
      .set({
        name: body.name,
        description: body.description ?? null,
        brand: body.brand ?? null,
        quantity: body.quantity,
        toteId: body.toteId,
      })
      .where(eq(items.id, params.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT item error:", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(items).where(eq(items.id, params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE item error:", err);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
