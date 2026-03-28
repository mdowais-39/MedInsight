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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="doctor_id"
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
          cursor={{ fill: "var(--color-accent)", opacity: 0.1 }}
          formatter={(value) => `${value} visits`}
        />
        <Bar dataKey="total_visits" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
