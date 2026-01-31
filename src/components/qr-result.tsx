"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateQrResult } from "@/app/actions";

type SuccessResult = Extract<CreateQrResult, { success: true }>;

export function QrResult({ result }: { result: SuccessResult }) {
  const [copied, setCopied] = useState<string | null>(null);

  function handleDownload() {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${result.qrBase64}`;
    link.download = `qr-${result.shortCode}.png`;
    link.click();
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription>
          Scan this code to be redirected to your URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center rounded-lg bg-white p-4">
          <img
            src={result.qrDataUrl}
            alt="QR Code"
            width={256}
            height={256}
          />
        </div>

        <Button onClick={handleDownload} className="w-full">
          Download PNG
        </Button>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tracking URL</label>
          <div className="flex gap-2">
            <Input value={result.trackingUrl} readOnly className="flex-1" />
            <Button
              variant="outline"
              onClick={() =>
                copyToClipboard(result.trackingUrl, "tracking")
              }
            >
              {copied === "tracking" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Analytics Page</label>
          <div className="flex gap-2">
            <Input value={result.analyticsUrl} readOnly className="flex-1" />
            <Button
              variant="outline"
              onClick={() =>
                copyToClipboard(result.analyticsUrl, "analytics")
              }
            >
              {copied === "analytics" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
