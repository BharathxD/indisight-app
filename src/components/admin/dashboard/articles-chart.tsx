"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { trpc } from "@/trpc/client";

const chartConfig = {
  count: {
    label: "Articles",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const ArticlesChart = () => {
  const [days, setDays] = useState<"7" | "30">("7");

  const { data, isLoading } = trpc.analytics.getPublishedTimeSeries.useQuery({
    days,
  });

  const formattedData = data?.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: item.count,
  }));

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Published Articles</CardTitle>
          <CardDescription>Articles published over time</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setDays("7")}
            size="sm"
            variant={days === "7" ? "default" : "outline"}
          >
            7 days
          </Button>
          <Button
            onClick={() => setDays("30")}
            size="sm"
            variant={days === "30" ? "default" : "outline"}
          >
            30 days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        ) : (
          <ChartContainer className="h-[300px] w-full" config={chartConfig}>
            <AreaChart accessibilityLayer data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="date"
                tickFormatter={(value) => value}
                tickLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                fill="var(--color-count)"
                fillOpacity={0.2}
                stroke="var(--color-count)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
