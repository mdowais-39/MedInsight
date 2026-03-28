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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="doctor_id" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
          cursor={{ fill: "var(--color-primary)", opacity: 0.1 }}
        />
        <Bar dataKey="total_appointments" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
