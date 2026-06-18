"use client";
import { useState, useEffect, useCallback } from "react";
import LossBarChart from "@/components/charts/LossBarChart";
import LossDonut from "@/components/charts/LossDonut";
import FilterBar, { type Filters } from "@/components/FilterBar";

interface DashData {
  lossReasons: [string, number][];
  lost: number;
  _source?: string;
}

const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" };
const skeleton: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--bg-card) 25%, #1e2d4a 50%, var(--bg-card) 75%)",
  backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6,
};

export default function PerdasPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ start: f.start, end: f.end, pipeline: f.pipeline });
      const r = await fetch("/api/deals?" + p);
      const d = await r.json();
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
    load({ start, end, pipeline: "" });
  }, [load]);

  const reasons: [string, number][] = data?.lossReasons || [];
  const total: number = data?.lost || 0;
  const top = reasons[0];
  const topPct = top && total ? Math.round(top[1] / total * 100) : 0;

  return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Análise de Perdas</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Por que os deals foram perdidos?</p>
      </div>

      <FilterBar onChange={load} loading={loading} />

      {/* Insight card */}
      {top && (
        <div style={{ ...card, marginBottom: 16, background: "rgba(239,68,68,.08)", borderColor: "rgba(239,68,68,.3)", display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ fontSize: 28 }}>🔍</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Principal motivo de perda</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--red)" }}>"{top[0]}"</strong> representa{" "}
              <strong style={{ color: "var(--text)" }}>{topPct}% ({top[1]} de {total})</strong> dos deals perdidos.
              {topPct > 30 ? " Ação prioritária recomendada." : ""}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ranking de motivos</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 18 }}>Frequência dos motivos registrados</div>
          {!data ? <div style={{ ...skeleton, height: 200 }} /> : <LossBarChart data={reasons} />}
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Distribuição visual</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 18 }}>Proporção de cada motivo</div>
          {!data ? <div style={{ ...skeleton, height: 200 }} /> : <LossDonut data={reasons} />}
        </div>
      </div>

      {/* Detail table */}
      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 18 }}>Detalhamento por motivo</div>
        {!data ? <div style={{ ...skeleton, height: 120 }} /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["#","Motivo","Deals","% do total","Barra"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reasons.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Nenhuma perda com motivo registrado no período.</td></tr>
              ) : reasons.map(([label, count], i) => {
                const pct = total ? Math.round(count / total * 100) : 0;
                return (
                  <tr key={label}>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>{label}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", fontWeight: 700, color: "var(--red)" }}>{count}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>{pct}%</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ height: 6, background: "var(--border)", borderRadius: 3, width: 120, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", background: "var(--red)", borderRadius: 3, opacity: .7 }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
