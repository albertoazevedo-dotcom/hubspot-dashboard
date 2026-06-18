"use client";
import { useState, useCallback, useEffect } from "react";
import KpiCard from "@/components/KpiCard";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import StatusDonut from "@/components/charts/StatusDonut";
import StageFunnel from "@/components/charts/StageFunnel";
import RevenueArea from "@/components/charts/RevenueArea";
import LossBarChart from "@/components/charts/LossBarChart";
import FilterBar, { type Filters } from "@/components/FilterBar";

function fmtBRL(v: number) {
  if (!v && v !== 0) return "—";
  return "R$ " + Math.round(v).toLocaleString("pt-BR");
}
function fmtDate(s: string) {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR"); } catch { return s; }
}
function badge(prob: number) {
  if (prob >= 70) return { label: "Quente", bg: "rgba(34,197,94,.15)", color: "#22c55e" };
  if (prob >= 40) return { label: "Médio",  bg: "rgba(249,115,22,.15)", color: "#f97316" };
  return               { label: "Frio",   bg: "rgba(239,68,68,.15)",  color: "#ef4444" };
}

const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" };
const cardTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 };
const cardSub: React.CSSProperties = { fontSize: 11, color: "var(--text-muted)", marginBottom: 18 };
const skeleton: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--bg-card) 25%, #1e2d4a 50%, var(--bg-card) 75%)",
  backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6,
};

type DashData = Awaited<ReturnType<typeof fetchData>>;

async function fetchData(f: Filters) {
  const p = new URLSearchParams({ start: f.start, end: f.end, pipeline: f.pipeline });
  const r = await fetch("/api/deals?" + p);
  return r.json();
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (f: Filters) => {
    setLoading(true);
    try { setData(await fetchData(f)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  // load once on mount with default 90-day filter (FilterBar will call onChange on chip init below)
  const [initialLoad, setInitialLoad] = useState(false);
  const handleFilter = useCallback((f: Filters) => {
    setInitialLoad(true);
    load(f);
  }, [load]);

  // fallback in case FilterBar doesn't fire immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialLoad) {
        const end = new Date().toISOString().slice(0, 10);
        const start = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        load({ start, end, pipeline: "" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [initialLoad, load]);

  const d = data;

  return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}`}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Visão geral do pipeline de vendas</p>
      </div>

      <FilterBar onChange={handleFilter} loading={loading} />

      {/* Source indicator */}
      {d?._source && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: d._source === "hubspot" ? "var(--green)" : "var(--amber)", display: "inline-block" }} />
          {d._source === "hubspot" ? "Dados reais do HubSpot" : "Dados de demonstração — conecte o HubSpot para dados reais"}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {!d ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...card, height: 90 }}>
              <div style={{ ...skeleton, height: 10, width: 80, marginBottom: 12 }} />
              <div style={{ ...skeleton, height: 28, width: 60 }} />
            </div>
          ))
        ) : (
          <>
            <KpiCard label="Total de deals" value={d.total} sub="no período" />
            <KpiCard label="Ganhos" value={d.won} sub={fmtBRL(d.wonAmount)} color="var(--green)" />
            <KpiCard label="Conversão" value={d.conversionRate + "%"} sub="ganhos / total" color="var(--accent)" />
            <KpiCard label="Perdidos" value={d.lost} sub={d.total ? Math.round(d.lost / d.total * 100) + "% do total" : "—"} color="var(--red)" />
            <KpiCard label="Em aberto" value={d.open} sub="deals ativos" color="var(--orange)" />
            <KpiCard label="Ticket médio" value={fmtBRL(d.avgDealSize)} sub="por deal" color="var(--amber)" />
          </>
        )}
      </div>

      {/* Row 1: Monthly bar + Status donut */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={cardTitle}>Volume por mês</div>
          <div style={cardSub}>Deals criados no período</div>
          {!d ? <div style={{ ...skeleton, height: 220 }} /> : <MonthlyBarChart data={d.byMonth} />}
        </div>
        <div style={card}>
          <div style={cardTitle}>Distribuição de status</div>
          <div style={cardSub}>Ganhos · Perdidos · Em aberto</div>
          {!d ? <div style={{ ...skeleton, height: 180 }} /> : (
            <>
              <StatusDonut won={d.won} lost={d.lost} open={d.open} />
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                {([["Ganhos","var(--green)",d.won],["Perdidos","var(--red)",d.lost],["Em aberto","var(--orange)",d.open]] as [string,string,number][]).map(([l,c,v]) => (
                  <span key={l} style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />
                    {l}: {v}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Revenue area + Stage funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={cardTitle}>Receita por mês</div>
          <div style={cardSub}>Valor total dos deals criados</div>
          {!d ? <div style={{ ...skeleton, height: 200 }} /> : <RevenueArea data={d.byMonth} />}
        </div>
        <div style={card}>
          <div style={cardTitle}>Funil por estágio</div>
          <div style={cardSub}>Deals em aberto por etapa</div>
          {!d ? <div style={{ ...skeleton, height: 200 }} /> : <StageFunnel data={d.stageFunnel} />}
        </div>
      </div>

      {/* Row 3: Loss reasons + Top deals */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <div style={cardTitle}>Top motivos de perda</div>
          <div style={cardSub}>Frequência dos motivos registrados</div>
          {!d ? <div style={{ ...skeleton, height: 180 }} /> : <LossBarChart data={d.lossReasons} />}
        </div>
        <div style={card}>
          <div style={cardTitle}>Top 8 deals em aberto</div>
          <div style={cardSub}>Maior probabilidade de fechamento</div>
          {!d ? <div style={{ ...skeleton, height: 180 }} /> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["Deal","Valor","Fecha","Prob."].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(d.openDeals as Array<{ id: string; name: string; amount: number; closeDate: string; probability: number }>).slice(0, 8).map(deal => {
                    const b = badge(deal.probability);
                    const overdue = deal.closeDate && new Date(deal.closeDate) < new Date();
                    return (
                      <tr key={deal.id}>
                        <td style={{ padding: "9px 10px", borderBottom: "1px solid var(--border)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{deal.name}</td>
                        <td style={{ padding: "9px 10px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>{fmtBRL(deal.amount)}</td>
                        <td style={{ padding: "9px 10px", borderBottom: "1px solid var(--border)", color: overdue ? "var(--red)" : "var(--text-muted)" }}>{fmtDate(deal.closeDate)}</td>
                        <td style={{ padding: "9px 10px", borderBottom: "1px solid var(--border)" }}>
                          <span style={{ background: b.bg, color: b.color, padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600 }}>{b.label} {deal.probability}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
