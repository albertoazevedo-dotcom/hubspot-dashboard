"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: Record<string, { amount: number }> }

function fmtBRL(v: number) { return "R$ " + Math.round(v / 1000) + "k"; }

export default function RevenueArea({ data }: Props) {
  const chartData = Object.entries(data).map(([month, v]) => {
    const [y, m] = month.split("-");
    const label = new Date(Number(y), Number(m) - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    return { month: label, Receita: v.amount };
  });
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }} />
        <Area type="monotone" dataKey="Receita" stroke="#6366f1" fill="url(#colorReceita)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
