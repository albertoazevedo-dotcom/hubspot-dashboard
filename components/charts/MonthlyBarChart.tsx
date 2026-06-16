"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: Record<string, { won: number; lost: number; open: number }>;
}

export default function MonthlyBarChart({ data }: Props) {
  const chartData = Object.entries(data).map(([month, v]) => {
    const [y, m] = month.split("-");
    const label = new Date(Number(y), Number(m) - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    return { month: label, Ganhos: v.won, Perdidos: v.lost, "Em aberto": v.open };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }} />
        <Bar dataKey="Ganhos" stackId="a" fill="#22c55e" />
        <Bar dataKey="Perdidos" stackId="a" fill="#ef4444" />
        <Bar dataKey="Em aberto" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
