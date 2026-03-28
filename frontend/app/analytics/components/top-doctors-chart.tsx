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
  doctors: Map<number, string>;
}

export function TopDoctorsChart({ data, doctors }: TopDoctorsChartProps) {
  // Take only top 5 doctors
  const chartData = data.slice(0, 5).map((item) => ({
    ...item,
    doctor_name: doctors.get(item.doctor_id) || `Doctor ${item.doctor_id}`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="doctor_name" 
          stroke="hsl(var(--muted-foreground))"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
          }}
          cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
          formatter={(value) => [`${value} appointments`, "Appointments"]}
        />
        <Bar dataKey="total_appointments" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
