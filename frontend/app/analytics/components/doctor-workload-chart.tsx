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
  doctors: Map<number, string>;
}

export function DoctorWorkloadChart({ data, doctors }: DoctorWorkloadChartProps) {
  // Take only top 10 doctors and reverse for better visualization (highest at bottom)
  const chartData = data
    .slice(0, 10)
    .map((item) => ({
      ...item,
      doctor_name: doctors.get(item.doctor_id) || `Doctor ${item.doctor_id}`,
    }))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
        <YAxis 
          dataKey="doctor_name" 
          type="category" 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
          }}
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
          formatter={(value) => [`${value} visits`, "Total Visits"]}
        />
        <Bar dataKey="total_visits" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
