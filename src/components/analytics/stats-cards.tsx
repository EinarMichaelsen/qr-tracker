import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalScans: number;
  uniqueVisitors: number;
  createdAt: Date;
}

export function StatsCards({
  totalScans,
  uniqueVisitors,
  createdAt,
}: StatsCardsProps) {
  const daysSinceCreated = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalScans}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{uniqueVisitors}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Days Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {daysSinceCreated < 1 ? "<1" : daysSinceCreated}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
