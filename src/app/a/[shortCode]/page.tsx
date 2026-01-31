import { notFound } from "next/navigation";
import { getQrCode, getAnalytics } from "@/lib/analytics";
import { StatsCards } from "@/components/analytics/stats-cards";
import { ScanChart } from "@/components/analytics/scan-chart";
import { CountryTable } from "@/components/analytics/country-table";
import { DeviceBreakdown } from "@/components/analytics/device-breakdown";
import { ReferrerTable } from "@/components/analytics/referrer-table";
import { Badge } from "@/components/ui/badge";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  const qr = await getQrCode(shortCode);

  if (!qr) {
    notFound();
  }

  const analytics = await getAnalytics(shortCode);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Analytics
          </h1>
          <Badge variant="secondary">{shortCode}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Destination:{" "}
          <a
            href={qr.destinationUrl}
            className="underline underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            {qr.destinationUrl}
          </a>
        </p>
      </div>

      <div className="space-y-6">
        <StatsCards
          totalScans={analytics.totalScans}
          uniqueVisitors={analytics.uniqueVisitors}
          createdAt={qr.createdAt}
        />

        <ScanChart data={analytics.scansPerDay} />

        <div className="grid gap-6 lg:grid-cols-2">
          <CountryTable data={analytics.topCountries} />
          <DeviceBreakdown
            devices={analytics.deviceBreakdown.map((d) => ({
              name: d.deviceType,
              count: d.count,
            }))}
            os={analytics.osBreakdown.map((d) => ({
              name: d.os,
              count: d.count,
            }))}
            browsers={analytics.browserBreakdown.map((d) => ({
              name: d.browser,
              count: d.count,
            }))}
          />
        </div>

        <ReferrerTable data={analytics.topReferrers} />
      </div>
    </main>
  );
}
