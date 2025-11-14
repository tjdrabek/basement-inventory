import QRCode from "qrcode";
import path from "path";
import fs from "fs";

export async function generateToteQR(toteId: string) {
  const qrDir = path.join(process.cwd(), "public/qrcodes");
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  const qrPath = path.join(qrDir, `${toteId}.png`);
  // Use BASE_URL for server-side generation, fallback to localhost
  const baseUrl =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const url = `${baseUrl}/tote/${toteId}`;

  console.log(`Generating QR code for URL: ${url}`); // Debug log

  await QRCode.toFile(qrPath, url);

  return `/api/qrcodes/${toteId}.png`;
}
