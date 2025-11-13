import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const totes = sqliteTable("totes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  qrCodeUrl: text("qr_code_url"),
  createdAt: integer("created_at").default(
    sql`(cast(strftime('%s','now') as int))`
  ),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  brand: text("brand"),
  quantity: integer("quantity").notNull().default(1),
  toteId: text("tote_id").references(() => totes.id, { onDelete: "cascade" }),
  createdAt: integer("created_at").default(
    sql`(cast(strftime('%s','now') as int))`
  ),
});
