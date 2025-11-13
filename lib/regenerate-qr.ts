// Utility script to regenerate QR codes for existing totes
// This can be run manually or called from an API endpoint

import { db } from "@/lib/db";
import { totes } from "@/db/schema";
import { generateToteQR } from "@/lib/qr";
import { eq } from "drizzle-orm";

export async function regenerateAllQRCodes() {
  try {
    console.log("Starting QR code regeneration...");

    const allTotes = await db.select().from(totes).all();
    console.log(`Found ${allTotes.length} totes to process`);

    let updated = 0;

    for (const tote of allTotes) {
      try {
        console.log(`Generating QR code for tote: ${tote.name} (${tote.id})`);
        const newQrCodeUrl = await generateToteQR(tote.id);

        await db
          .update(totes)
          .set({ qrCodeUrl: newQrCodeUrl })
          .where(eq(totes.id, tote.id));

        updated++;
        console.log(`✅ Updated QR code for: ${tote.name}`);
      } catch (error) {
        console.error(
          `❌ Failed to update QR code for tote ${tote.id}:`,
          error
        );
      }
    }

    console.log(
      `✅ QR code regeneration complete. Updated ${updated}/${allTotes.length} totes.`
    );
    return { success: true, updated, total: allTotes.length };
  } catch (error) {
    console.error("❌ QR code regeneration failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
