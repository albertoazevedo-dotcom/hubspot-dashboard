export const HS_BASE = "https://api.hubapi.com";
export const HS_AUTH_URL = "https://app.hubspot.com/oauth/authorize";
export const HS_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";

export const SCOPES = [
  "crm.objects.deals.read",
  "crm.schemas.deals.read",
].join(" ");

export const DEAL_PROPS = [
  "dealname", "amount", "closedate", "createdate",
  "dealstage", "pipeline", "hs_deal_stage_probability",
  "closed_lost_reason", "hs_is_closed_won", "hs_is_closed",
];

export function getRedirectUri() {
  return process.env.HUBSPOT_REDIRECT_URI || "http://localhost:3000/oauth/callback";
}

export async function hsGet(token: string, path: string, params: Record<string, string> = {}) {
  const url = new URL(HS_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`HubSpot API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function hsPost(token: string, path: string, body: unknown) {
  const res = await fetch(HS_BASE + path, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HubSpot API error ${res.status}: ${await res.text()}`);
  return res.json();
}

const STAGES_ORDER = ["Prospecção", "Qualificação", "Proposta", "Negociação", "Contrato"];

export function processSummary(
  deals: Array<{ id: string; properties: Record<string, string> }>,
  stagesMap: Record<string, string>
) {
  const byMonth: Record<string, { total: number; won: number; lost: number; open: number; amount: number }> = {};
  const lossReasons: Record<string, number> = {};
  const openDeals: Array<{ id: string; name: string; amount: number; stage: string; closeDate: string; probability: number; pipeline: string }> = [];
  let wonCount = 0, lostCount = 0, wonAmount = 0, totalAmount = 0;

  deals.forEach(d => {
    const p = d.properties;
    const isWon = p.hs_is_closed_won === "true";
    const isClosed = p.hs_is_closed === "true";
    const amount = parseFloat(p.amount) || 0;
    const stage = stagesMap[p.dealstage] || p.dealstage || "—";
    totalAmount += amount;

    if (isWon) { wonCount++; wonAmount += amount; }
    else if (isClosed) {
      lostCount++;
      const r = p.closed_lost_reason || "Não informado";
      lossReasons[r] = (lossReasons[r] || 0) + 1;
    } else {
      const prob = p.hs_deal_stage_probability
        ? Math.round(parseFloat(p.hs_deal_stage_probability) * 100) : null;
      openDeals.push({ id: d.id, name: p.dealname || "—", amount, stage, closeDate: p.closedate, probability: prob ?? 0, pipeline: p.pipeline });
    }

    const cd = p.createdate;
    if (cd) {
      const dt = new Date(cd);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) byMonth[key] = { total: 0, won: 0, lost: 0, open: 0, amount: 0 };
      byMonth[key].total++;
      byMonth[key].amount += amount;
      if (isWon) byMonth[key].won++;
      else if (isClosed) byMonth[key].lost++;
      else byMonth[key].open++;
    }
  });

  const total = deals.length;
  openDeals.sort((a, b) => b.probability - a.probability);

  const stageCounts: Record<string, number> = {};
  openDeals.forEach(d => { stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1; });
  const stageFunnel = STAGES_ORDER.map(s => ({ stage: s, count: stageCounts[s] || 0 }));

  const sortedByMonth = Object.keys(byMonth).sort().reduce((o: typeof byMonth, k) => { o[k] = byMonth[k]; return o; }, {});

  return {
    total, won: wonCount, lost: lostCount, open: openDeals.length,
    conversionRate: total ? Math.round((wonCount / total) * 1000) / 10 : 0,
    totalAmount, wonAmount,
    avgDealSize: total ? Math.round(totalAmount / total) : 0,
    byMonth: sortedByMonth,
    lossReasons: Object.entries(lossReasons).sort((a, b) => b[1] - a[1]) as [string, number][],
    openDeals: openDeals.slice(0, 50),
    stageFunnel,
  };
}
