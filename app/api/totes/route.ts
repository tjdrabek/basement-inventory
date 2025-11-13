import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { totes } from "@/db/schema";
import { randomUUID } from "crypto";
import { generateToteQR } from "@/lib/qr";

export async function GET() {
  try {
    const rows = await db.select().from(totes).orderBy(totes.createdAt);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/totes error:", err);
    return NextResponse.json(
      { error: "Failed to fetch totes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    const id = randomUUID();
    const qrCodeUrl = await generateToteQR(id);

    await db.insert(totes).values({
      id,
      name,
      description: description ?? null,
      qrCodeUrl,
    });

    return NextResponse.json({ id });
  } catch (err) {
    console.error("POST /api/totes error:", err);
    return NextResponse.json(
      { error: "Failed to create tote" },
      { status: 500 }
    );
  }
}
