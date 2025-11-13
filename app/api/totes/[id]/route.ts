import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { totes, items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tote = await db.select().from(totes).where(eq(totes.id, id)).limit(1);

    if (tote.length === 0) {
      return NextResponse.json({ error: "Tote not found" }, { status: 404 });
    }

    const toteItems = await db.select().from(items).where(eq(items.toteId, id));

    return NextResponse.json({
      ...tote[0],
      items: toteItems,
    });
  } catch (err) {
    console.error("GET /api/totes/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch tote" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await db
      .update(totes)
      .set({
        name: body.name,
        description: body.description ?? null,
      })
      .where(eq(totes.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/totes/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update tote" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(totes).where(eq(totes.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/totes/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete tote" },
      { status: 500 }
    );
  }
}
