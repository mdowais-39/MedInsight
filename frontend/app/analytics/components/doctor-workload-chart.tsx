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
import { DoctorWorkload } from "@/lib/api";

interface DoctorWorkloadChartProps {
  data: DoctorWorkload[];
}

export function DoctorWorkloadChart({ data }: DoctorWorkloadChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    doctor_id: `Dr. ${item.doctor_id}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="doctor_id"
          stroke="hsl(var(--muted-foreground))"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
          }}
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
          formatter={(value) => `${value} visits`}
        />
        <Bar dataKey="total_visits" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
