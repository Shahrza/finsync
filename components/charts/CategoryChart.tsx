"use client";

import { Pie, PieChart } from "recharts";
import { useTranslations } from "next-intl";
import "./category-chart.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { categories } from "@/utils/categories";
import { getHexFromTailwindClass } from "@/lib/utils";

export default function CategoryChart({
  data,
  label,
  dateRange,
}: {
  data: any;
  label: string;
  dateRange?: string;
}) {
  const t = useTranslations("category");
  const transactionT = useTranslations("transaction");

  if (!data || data.length === 0) {
    return (
      <Card className="pie-chart flex flex-col dark:bg-zinc-900">
        <CardHeader className="items-center pb-2">
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-gray-500">
            {transactionT("no_data_between_dates")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig: ChartConfig = {
    percentage: {
      label: "Percentage",
    },
    ...Object.entries(categories).reduce((config, [key, value]) => {
      return {
        ...config,
        [key]: {
          label: t(key),
          color: getHexFromTailwindClass(value.color),
        },
      };
    }, {}),
  };
  const chartData = data.map((item: any) => ({
    ...item,
    fill: chartConfig[item.value]?.color,
  }));

  return (
    <Card className="pie-chart flex flex-col dark:bg-zinc-900">
      <CardHeader className="items-center pb-0">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="visitors"
                  nameKey="value"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return `${transactionT("amount")}: ${
                      payload?.[0].payload.amount
                    }$`;
                  }}
                />
              }
            />
            <Pie data={chartData} dataKey="percentage" label nameKey="value" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
