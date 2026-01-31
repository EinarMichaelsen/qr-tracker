"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createQrCode, type CreateQrResult } from "@/app/actions";
import { QrResult } from "./qr-result";

export function QrForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<CreateQrResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    startTransition(async () => {
      const res = await createQrCode(url);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create QR"}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && result.success && <QrResult result={result} />}
    </div>
  );
}
