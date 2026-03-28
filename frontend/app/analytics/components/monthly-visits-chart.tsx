"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MonthlyVisit } from "@/lib/api";

interface MonthlyVisitsChartProps {
  data: MonthlyVisit[];
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthlyVisitsChart({ data }: MonthlyVisitsChartProps) {
  const chartData = data
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((item) => ({
      ...item,
      monthYear: `${monthNames[item.month - 1]} ${item.year}`,
    }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="monthYear"
          stroke="var(--color-muted-foreground)"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
          formatter={(value) => `${value} visits`}
        />
        <Line
          type="monotone"
          dataKey="total_visits"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: "var(--color-primary)", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
