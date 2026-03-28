"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DepartmentLoad } from "@/lib/api";

interface DepartmentLoadChartProps {
  data: DepartmentLoad[];
  departments: Map<number, string>;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export function DepartmentLoadChart({ data, departments }: DepartmentLoadChartProps) {
  const totalVisits = data.reduce((sum, item) => sum + item.total_visits, 0);
  
  const chartData = data.map((item) => ({
    ...item,
    name: departments.get(item.department_id) || `Department ${item.department_id}`,
    value: item.total_visits,
    percentage: totalVisits > 0 ? ((item.total_visits / totalVisits) * 100).toFixed(1) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
          }}
          formatter={(value, name, props) => [`${value} visits`, "Total"]}
        />
        <Legend
          wrapperStyle={{
            color: "hsl(var(--foreground))",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
