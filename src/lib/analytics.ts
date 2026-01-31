import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function getQrCode(shortCode: string) {
  const [qr] = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.shortCode, shortCode))
    .limit(1);
  return qr || null;
}

export async function getAnalytics(shortCode: string) {
  const [totalScans] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(scans)
    .where(eq(scans.shortCode, shortCode));

  const [uniqueVisitors] = await db
    .select({
      count: sql<number>`count(distinct ${scans.visitorId})::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode));

  const scansPerDay = await db
    .select({
      date: sql<string>`date(${scans.scannedAt})`,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(sql`date(${scans.scannedAt})`)
    .orderBy(sql`date(${scans.scannedAt})`);

  const topCountries = await db
    .select({
      country: scans.country,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(scans.country)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const deviceBreakdown = await db
    .select({
      deviceType: scans.deviceType,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(scans.deviceType)
    .orderBy(desc(sql`count(*)`));

  const osBreakdown = await db
    .select({
      os: scans.os,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(scans.os)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const browserBreakdown = await db
    .select({
      browser: scans.browser,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(scans.browser)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const topReferrers = await db
    .select({
      referrer: scans.referrer,
      count: sql<number>`count(*)::int`,
    })
    .from(scans)
    .where(eq(scans.shortCode, shortCode))
    .groupBy(scans.referrer)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return {
    totalScans: totalScans.count,
    uniqueVisitors: uniqueVisitors.count,
    scansPerDay,
    topCountries,
    deviceBreakdown,
    osBreakdown,
    browserBreakdown,
    topReferrers,
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;
