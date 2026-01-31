import {
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
  index,
} from "drizzle-orm/pg-core";

export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  shortCode: varchar("short_code", { length: 12 }).notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scans = pgTable(
  "scans",
  {
    id: serial("id").primaryKey(),
    shortCode: varchar("short_code", { length: 12 }).notNull(),
    scannedAt: timestamp("scanned_at").defaultNow().notNull(),
    ip: varchar("ip", { length: 45 }),
    country: varchar("country", { length: 100 }),
    region: varchar("region", { length: 100 }),
    city: varchar("city", { length: 100 }),
    deviceType: varchar("device_type", { length: 50 }),
    os: varchar("os", { length: 100 }),
    browser: varchar("browser", { length: 100 }),
    referrer: text("referrer"),
    visitorId: varchar("visitor_id", { length: 32 }),
  },
  (table) => [
    index("scans_short_code_idx").on(table.shortCode),
    index("scans_scanned_at_idx").on(table.scannedAt),
  ]
);
