"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { z } from "zod";

const urlSchema = z.string().url("Please enter a valid URL");

export type CreateQrResult = {
  success: true;
  shortCode: string;
  qrDataUrl: string;
  qrBase64: string;
  analyticsUrl: string;
  trackingUrl: string;
} | {
  success: false;
  error: string;
};

export async function createQrCode(url: string): Promise<CreateQrResult> {
  const parsed = urlSchema.safeParse(url);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const shortCode = nanoid(8);
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const appUrl = `${proto}://${host}`;
  const trackingUrl = `${appUrl}/r/${shortCode}`;

  await db.insert(qrCodes).values({
    shortCode,
    destinationUrl: parsed.data,
  });

  const qrBuffer = await QRCode.toBuffer(trackingUrl, {
    width: 512,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#00000000",
    },
    type: "png",
  });

  const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
    width: 512,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#00000000",
    },
    type: "image/png",
  });

  return {
    success: true,
    shortCode,
    qrDataUrl,
    qrBase64: qrBuffer.toString("base64"),
    analyticsUrl: `${appUrl}/a/${shortCode}`,
    trackingUrl,
  };
}
