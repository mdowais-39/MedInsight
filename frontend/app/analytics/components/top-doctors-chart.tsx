"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TopDoctor } from "@/lib/api";

interface TopDoctorsChartProps {
  data: TopDoctor[];
}

export function TopDoctorsChart({ data }: TopDoctorsChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    doctor_id: `Dr. ${item.doctor_id}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis dataKey="doctor_id" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
        />
        <Bar dataKey="total_appointments" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
