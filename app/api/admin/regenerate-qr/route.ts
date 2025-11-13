import { NextResponse } from "next/server";
import { regenerateAllQRCodes } from "@/lib/regenerate-qr";

export async function POST() {
  try {
    const result = await regenerateAllQRCodes();

    if (result.success) {
      return NextResponse.json({
        message: `Successfully regenerated QR codes for ${result.updated}/${result.total} totes`,
        ...result,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("QR regeneration API error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate QR codes" },
      { status: 500 }
    );
  }
}
