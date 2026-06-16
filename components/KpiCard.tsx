interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export default function KpiCard({ label, value, sub, color = "var(--text)" }: KpiCardProps) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".7px", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
