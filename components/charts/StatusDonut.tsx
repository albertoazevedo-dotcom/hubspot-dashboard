"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props { won: number; lost: number; open: number; }

export default function StatusDonut({ won, lost, open }: Props) {
  const data = [
    { name: "Ganhos", value: won, color: "var(--green)" },
    { name: "Perdidos", value: lost, color: "var(--red)" },
    { name: "Em aberto", value: open, color: "var(--orange)" },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
          {data.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
