"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScanChartProps {
  data: { date: string; count: number }[];
}

export function ScanChart({ data }: ScanChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scans Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-muted-foreground">
            No scan data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scans Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickFormatter={(val) =>
                new Date(val).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip
              labelFormatter={(val) =>
                new Date(val).toLocaleDateString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--foreground))"
              fill="hsl(var(--foreground) / 0.1)"
              name="Scans"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
