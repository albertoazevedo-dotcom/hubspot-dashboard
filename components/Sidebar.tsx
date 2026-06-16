"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitBranch, TrendingDown, Zap, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/perdas", label: "Análise de Perdas", icon: TrendingDown },
];

export default function Sidebar() {
  const path = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth-status").then(r => r.json()).then(d => setAuthed(d.authenticated)).catch(() => setAuthed(false));
  }, []);

  return (
    <aside style={{ width: 220, background: "var(--bg-card)", borderRight: "1px solid var(--border)", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 20px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
        <Zap size={18} color="var(--accent)" />
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>HubSpot Intel</span>
      </div>

      {nav.map(({ href, label, icon: Icon }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
            borderRadius: 8, fontSize: 13, textDecoration: "none",
            color: active ? "var(--text)" : "var(--text-muted)",
            background: active ? "rgba(99,102,241,0.12)" : "transparent",
            fontWeight: active ? 600 : 400,
            transition: "all .15s",
          }}>
            <Icon size={15} color={active ? "var(--accent)" : "var(--text-muted)"} />
            {label}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto" }}>
        {authed !== null && (
          <>
            {authed && (
              <div style={{ fontSize: 11, color: "var(--green)", padding: "4px 12px 8px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                HubSpot conectado
              </div>
            )}
            <a href={authed ? "/oauth/logout" : "/oauth/start"} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 8, fontSize: 13, textDecoration: "none",
              color: authed ? "var(--text-muted)" : "var(--accent)",
              border: `1px solid ${authed ? "var(--border)" : "var(--accent)"}`,
              background: authed ? "transparent" : "rgba(99,102,241,0.08)",
            }}>
              {authed ? <LogOut size={14} /> : <LogIn size={14} />}
              {authed ? "Desconectar" : "Conectar HubSpot"}
            </a>
          </>
        )}
      </div>
    </aside>
  );
}
