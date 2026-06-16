"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  closeDate: string;
  probability: number;
  pipeline: string;
}

function fmtBRL(v: number) { return v ? "R$ " + Math.round(v).toLocaleString("pt-BR") : "—"; }
function fmtDate(s: string) {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR"); } catch { return s; }
}
function badge(prob: number) {
  if (prob >= 70) return { label: "Quente", bg: "rgba(34,197,94,.15)", color: "#22c55e" };
  if (prob >= 40) return { label: "Médio", bg: "rgba(249,115,22,.15)", color: "#f97316" };
  return { label: "Frio", bg: "rgba(239,68,68,.15)", color: "#ef4444" };
}

type SortKey = keyof Deal;

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "probability", dir: "desc" });

  const load = useCallback(async () => {
    const r = await fetch("/api/deals");
    const d = await r.json();
    setDeals(d.openDeals || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = deals
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.stage.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sort.key] ?? 0;
      const bv = b[sort.key] ?? 0;
      return sort.dir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  function toggleSort(key: SortKey) {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sort.key !== k) return <ArrowUpDown size={12} color="var(--text-muted)" />;
    return sort.dir === "asc" ? <ArrowUp size={12} color="var(--accent)" /> : <ArrowDown size={12} color="var(--accent)" />;
  }

  const thStyle = { textAlign: "left" as const, padding: "10px 12px", fontSize: 11, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", fontWeight: 500, cursor: "pointer", userSelect: "none" as const, whiteSpace: "nowrap" as const };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Pipeline</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Deals em aberto com probabilidade de fechamento</p>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar deal ou estágio..."
            style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, flex: 1 }}
          />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} deals</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Deal <SortIcon k="name" /></span></th>
                <th onClick={() => toggleSort("stage")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Estágio <SortIcon k="stage" /></span></th>
                <th onClick={() => toggleSort("amount")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Valor <SortIcon k="amount" /></span></th>
                <th onClick={() => toggleSort("closeDate")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Fechamento <SortIcon k="closeDate" /></span></th>
                <th onClick={() => toggleSort("probability")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Prob. <SortIcon k="probability" /></span></th>
                <th style={{ ...thStyle, cursor: "default" }}>Status</th>
                <th onClick={() => toggleSort("pipeline")} style={thStyle}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Pipeline <SortIcon k="pipeline" /></span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const b = badge(d.probability);
                const overdue = d.closeDate && new Date(d.closeDate) < new Date();
                return (
                  <tr key={d.id}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>{d.stage}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>{fmtBRL(d.amount)}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", color: overdue ? "var(--red)" : "var(--text-muted)" }}>{fmtDate(d.closeDate)}{overdue ? " ⚠" : ""}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", fontWeight: 700, color: b.color }}>{d.probability}%</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ background: b.bg, color: b.color, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{b.label}</span>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}>{d.pipeline}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Nenhum deal encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
