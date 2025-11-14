import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const qrPath = path.join(process.cwd(), "public/qrcodes", id);

    // Check if file exists
    if (!fs.existsSync(qrPath)) {
      return new NextResponse("QR code not found", { status: 404 });
    }

    // Read the file
    const imageBuffer = fs.readFileSync(qrPath);

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving QR code:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
