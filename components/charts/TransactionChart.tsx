"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";

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
    <ResponsiveContainer height={300}>
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
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
    </ResponsiveContainer>
  );
}
