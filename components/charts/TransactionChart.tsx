"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
};

const chartConfig = {
  income: {
    label: "Income",
    color: "#49DE80",
  },
  expense: {
    label: "Expense",
    color: "#F77171",
  },
} satisfies ChartConfig;

export function TransactionChart({ data }: Props) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[400px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
