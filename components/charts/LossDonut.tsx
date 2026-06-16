"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#ef4444","#f97316","#f59e0b","#6366f1","#8b5cf6","#ec4899","#14b8a6"];

interface Props { data: [string, number][] }

export default function LossDonut({ data }: Props) {
  const chartData = data.map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
