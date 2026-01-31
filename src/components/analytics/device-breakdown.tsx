"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = [
  "hsl(0 0% 15%)",
  "hsl(0 0% 35%)",
  "hsl(0 0% 55%)",
  "hsl(0 0% 70%)",
  "hsl(0 0% 85%)",
];

interface BreakdownItem {
  name: string | null;
  count: number;
}

interface DeviceBreakdownProps {
  devices: BreakdownItem[];
  os: BreakdownItem[];
  browsers: BreakdownItem[];
}

function BreakdownPie({ data }: { data: BreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">No data yet</p>
    );
  }

  const chartData = data.map((d) => ({
    name: d.name || "Unknown",
    value: d.count,
  }));

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-1 text-sm">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeviceBreakdown({
  devices,
  os,
  browsers,
}: DeviceBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="device">
          <TabsList>
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
          </TabsList>
          <TabsContent value="device">
            <BreakdownPie
              data={devices.map((d) => ({
                name: d.name as string | null,
                count: d.count,
              }))}
            />
          </TabsContent>
          <TabsContent value="os">
            <BreakdownPie data={os} />
          </TabsContent>
          <TabsContent value="browser">
            <BreakdownPie data={browsers} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
