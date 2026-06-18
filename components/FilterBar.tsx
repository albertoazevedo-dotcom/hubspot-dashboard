"use client";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export interface Filters {
  start: string;
  end: string;
  pipeline: string;
}

interface Props {
  onChange: (f: Filters) => void;
  loading?: boolean;
}

const CHIPS = [
  { label: "7 dias",  days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "6 meses", days: 180 },
  { label: "1 ano",   days: 365 },
];

function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }

function daysAgoStr(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return toDateStr(d);
}

export default function FilterBar({ onChange, loading }: Props) {
  const [activeDays, setActiveDays] = useState(90);
  const [start, setStart] = useState(daysAgoStr(90));
  const [end, setEnd]     = useState(toDateStr(new Date()));
  const [pipeline, setPipeline] = useState("");
  const [pipelines, setPipelines] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/pipelines")
      .then(r => r.json())
      .then(d => setPipelines(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const emit = useCallback((s: string, e: string, p: string) => {
    onChange({ start: s, end: e, pipeline: p });
  }, [onChange]);

  function selectChip(days: number) {
    const s = daysAgoStr(days);
    const e = toDateStr(new Date());
    setActiveDays(days);
    setStart(s);
    setEnd(e);
    emit(s, e, pipeline);
  }

  function apply() { emit(start, end, pipeline); }

  const barStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8,
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "12px 16px", marginBottom: 24,
  };
  const chip = (active: boolean): React.CSSProperties => ({
    padding: "5px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer",
    border: `1px solid ${active ? "rgba(99,102,241,.6)" : "var(--border)"}`,
    background: active ? "rgba(99,102,241,.12)" : "transparent",
    color: active ? "var(--text)" : "var(--text-muted)",
    transition: "all .15s",
  });
  const input: React.CSSProperties = {
    background: "var(--bg-primary)", border: "1px solid var(--border)",
    color: "var(--text)", borderRadius: 7, padding: "6px 10px",
    fontSize: 12, outline: "none",
  };
  const select: React.CSSProperties = { ...input, minWidth: 150 };
  const btnApply: React.CSSProperties = {
    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
    cursor: "pointer", border: "1px solid var(--border)", background: "transparent",
    color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6,
    transition: "all .15s",
  };

  return (
    <div style={barStyle}>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Período:</span>
      {CHIPS.map(c => (
        <button key={c.days} style={chip(activeDays === c.days)} onClick={() => selectChip(c.days)}>
          {c.label}
        </button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {pipelines.length > 0 && (
          <select
            value={pipeline}
            onChange={e => { setPipeline(e.target.value); emit(start, end, e.target.value); }}
            style={select}
          >
            <option value="">Todos os pipelines</option>
            {pipelines.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        )}
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>De</span>
        <input type="date" value={start} onChange={e => setStart(e.target.value)} style={input} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Até</span>
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={input} />
        <button style={btnApply} onClick={apply}>
          <RefreshCw size={12} style={{ animation: loading ? "spin .8s linear infinite" : "none" }} />
          Aplicar
        </button>
      </div>
    </div>
  );
}
