import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { UAParser } from "ua-parser-js";
import { waitUntil } from "@vercel/functions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const [qr] = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.shortCode, shortCode))
    .limit(1);

  if (!qr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Extract analytics data
  const ua = new UAParser(request.headers.get("user-agent") || "");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const country = request.headers.get("x-vercel-ip-country") || null;
  const region = request.headers.get("x-vercel-ip-country-region") || null;
  const city = request.headers.get("x-vercel-ip-city") || null;
  const referrer = request.headers.get("referer") || null;

  // Get or create visitor ID via cookie
  let visitorId = request.cookies.get("vid")?.value;
  const isNewVisitor = !visitorId;
  if (!visitorId) {
    visitorId = nanoid(16);
  }

  // Log scan asynchronously
  waitUntil(
    db.insert(scans).values({
      shortCode,
      ip,
      country,
      region,
      city,
      deviceType: ua.getDevice().type || "desktop",
      os: ua.getOS().name || null,
      browser: ua.getBrowser().name || null,
      referrer,
      visitorId,
    })
  );

  // 307 redirect to preserve every scan hit
  const response = NextResponse.redirect(qr.destinationUrl, 307);

  if (isNewVisitor) {
    response.cookies.set("vid", visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      path: "/",
    });
  }

  return response;
}
