import QRCode from "qrcode";
import path from "path";
import fs from "fs";

export async function generateToteQR(toteId: string) {
  const qrDir = path.join(process.cwd(), "public/qrcodes");
  if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir);

  const qrPath = path.join(qrDir, `${toteId}.png`);
  const url = `${process.env.APP_URL}/tote/${toteId}`;

  await QRCode.toFile(qrPath, url);

  return `/qrcodes/${toteId}.png`;
}
