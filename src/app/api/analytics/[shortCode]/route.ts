import { NextResponse } from "next/server";
import { getQrCode, getAnalytics } from "@/lib/analytics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;
  const qr = await getQrCode(shortCode);

  if (!qr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const analytics = await getAnalytics(shortCode);

  return NextResponse.json({
    qr: {
      shortCode: qr.shortCode,
      destinationUrl: qr.destinationUrl,
      createdAt: qr.createdAt,
    },
    ...analytics,
  });
}
