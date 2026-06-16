import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "HubSpot Pipeline Dashboard",
  description: "Sales pipeline intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: "auto", padding: "32px" }}>{children}</main>
      </body>
    </html>
  );
}
