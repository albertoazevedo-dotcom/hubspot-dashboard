import { NextResponse } from "next/server";

const STAGES = ["Prospecção", "Qualificação", "Proposta", "Negociação", "Contrato"];
const COMPANIES = [
  "Embraer", "Itaú BBA", "Magazine Luiza", "Votorantim", "Ambev",
  "Grupo Pão de Açúcar", "Localiza", "WEG Indústrias", "Bradesco Seguros",
  "Raízen", "Totvs", "Stone Pagamentos", "Nubank", "iFood", "Loft",
  "Creditas", "Gympass", "Vtex", "Hotmart", "Pagar.me",
  "Conta Azul", "RD Station", "Movile", "PagBank", "Unico",
];
const LOSS_REASONS = [
  "Preço alto demais",
  "Escolheu concorrente",
  "Sem orçamento",
  "Projeto cancelado",
  "Timing ruim",
  "Sem fit com produto",
  "Falta de decisão",
];

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }
function daysFromNow(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString(); }

const SEED_DEALS = [
  // Won deals (8)
  { id:"d1", name:`Plataforma IA - ${COMPANIES[0]}`, amount:85000, stage:STAGES[4], closeDate:daysAgo(10), probability:100, pipeline:"enterprise", status:"won", createdate:daysAgo(200) },
  { id:"d2", name:`CRM Enterprise - ${COMPANIES[1]}`, amount:120000, stage:STAGES[4], closeDate:daysAgo(25), probability:100, pipeline:"enterprise", status:"won", createdate:daysAgo(300) },
  { id:"d3", name:`Automação - ${COMPANIES[2]}`, amount:42000, stage:STAGES[4], closeDate:daysAgo(45), probability:100, pipeline:"default", status:"won", createdate:daysAgo(180) },
  { id:"d4", name:`Analytics - ${COMPANIES[3]}`, amount:67000, stage:STAGES[4], closeDate:daysAgo(60), probability:100, pipeline:"default", status:"won", createdate:daysAgo(250) },
  { id:"d5", name:`Data Lake - ${COMPANIES[4]}`, amount:95000, stage:STAGES[4], closeDate:daysAgo(90), probability:100, pipeline:"enterprise", status:"won", createdate:daysAgo(320) },
  { id:"d6", name:`ERP Integração - ${COMPANIES[5]}`, amount:38000, stage:STAGES[4], closeDate:daysAgo(120), probability:100, pipeline:"default", status:"won", createdate:daysAgo(360) },
  { id:"d7", name:`BI Dashboard - ${COMPANIES[6]}`, amount:29000, stage:STAGES[4], closeDate:daysAgo(150), probability:100, pipeline:"default", status:"won", createdate:daysAgo(280) },
  { id:"d8", name:`Cloud Migration - ${COMPANIES[7]}`, amount:145000, stage:STAGES[4], closeDate:daysAgo(30), probability:100, pipeline:"enterprise", status:"won", createdate:daysAgo(220) },
  // Lost deals (9)
  { id:"d9",  name:`Plataforma - ${COMPANIES[8]}`,  amount:55000, stage:STAGES[4], closeDate:daysAgo(15), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[0], createdate:daysAgo(190) },
  { id:"d10", name:`SaaS B2B - ${COMPANIES[9]}`,    amount:72000, stage:STAGES[4], closeDate:daysAgo(35), probability:0, pipeline:"enterprise",  status:"lost", lossReason:LOSS_REASONS[1], createdate:daysAgo(260) },
  { id:"d11", name:`Projeto X - ${COMPANIES[10]}`,  amount:33000, stage:STAGES[3], closeDate:daysAgo(50), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[2], createdate:daysAgo(210) },
  { id:"d12", name:`Pipeline - ${COMPANIES[11]}`,   amount:48000, stage:STAGES[4], closeDate:daysAgo(75), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[3], createdate:daysAgo(290) },
  { id:"d13", name:`Suite - ${COMPANIES[12]}`,      amount:61000, stage:STAGES[4], closeDate:daysAgo(100), probability:0, pipeline:"enterprise", status:"lost", lossReason:LOSS_REASONS[1], createdate:daysAgo(330) },
  { id:"d14", name:`API - ${COMPANIES[13]}`,        amount:27000, stage:STAGES[3], closeDate:daysAgo(130), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[4], createdate:daysAgo(370) },
  { id:"d15", name:`Growth - ${COMPANIES[14]}`,     amount:39000, stage:STAGES[4], closeDate:daysAgo(160), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[0], createdate:daysAgo(240) },
  { id:"d16", name:`DevOps - ${COMPANIES[15]}`,     amount:52000, stage:STAGES[4], closeDate:daysAgo(80), probability:0, pipeline:"enterprise",  status:"lost", lossReason:LOSS_REASONS[5], createdate:daysAgo(310) },
  { id:"d17", name:`Plataforma - ${COMPANIES[16]}`, amount:43000, stage:STAGES[3], closeDate:daysAgo(110), probability:0, pipeline:"default",    status:"lost", lossReason:LOSS_REASONS[6], createdate:daysAgo(345) },
  // Open deals (8)
  { id:"d18", name:`Enterprise Suite - ${COMPANIES[17]}`, amount:180000, stage:STAGES[3], closeDate:daysFromNow(30),  probability:75, pipeline:"enterprise", status:"open", createdate:daysAgo(60) },
  { id:"d19", name:`Growth Platform - ${COMPANIES[18]}`,  amount:95000,  stage:STAGES[2], closeDate:daysFromNow(45),  probability:60, pipeline:"default",   status:"open", createdate:daysAgo(45) },
  { id:"d20", name:`BI Suite - ${COMPANIES[19]}`,         amount:67000,  stage:STAGES[1], closeDate:daysFromNow(60),  probability:35, pipeline:"default",   status:"open", createdate:daysAgo(30) },
  { id:"d21", name:`Cloud Native - ${COMPANIES[20]}`,     amount:120000, stage:STAGES[3], closeDate:daysFromNow(20),  probability:80, pipeline:"enterprise", status:"open", createdate:daysAgo(75) },
  { id:"d22", name:`API Platform - ${COMPANIES[21]}`,     amount:44000,  stage:STAGES[1], closeDate:daysFromNow(90),  probability:25, pipeline:"default",   status:"open", createdate:daysAgo(15) },
  { id:"d23", name:`Data Platform - ${COMPANIES[22]}`,    amount:88000,  stage:STAGES[2], closeDate:daysFromNow(35),  probability:55, pipeline:"enterprise", status:"open", createdate:daysAgo(50) },
  { id:"d24", name:`Automação RPA - ${COMPANIES[23]}`,    amount:35000,  stage:STAGES[0], closeDate:daysFromNow(120), probability:15, pipeline:"default",   status:"open", createdate:daysAgo(10) },
  { id:"d25", name:`ML Ops - ${COMPANIES[24]}`,           amount:210000, stage:STAGES[3], closeDate:daysFromNow(15),  probability:85, pipeline:"enterprise", status:"open", createdate:daysAgo(90) },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const pipeline = searchParams.get("pipeline");

  let deals = SEED_DEALS;
  if (pipeline) deals = deals.filter(d => d.pipeline === pipeline);
  if (start) deals = deals.filter(d => new Date(d.createdate) >= new Date(start));
  if (end) deals = deals.filter(d => new Date(d.createdate) <= new Date(end + "T23:59:59"));

  const byMonth: Record<string, { total: number; won: number; lost: number; open: number; amount: number }> = {};
  let wonCount = 0, lostCount = 0, wonAmount = 0, totalAmount = 0;
  const lossMap: Record<string, number> = {};
  const openDeals: { id: string; name: string; amount: number; stage: string; closeDate: string; probability: number; pipeline: string }[] = [];

  deals.forEach(d => {
    const dt = new Date(d.createdate);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = { total: 0, won: 0, lost: 0, open: 0, amount: 0 };
    byMonth[key].total++;
    byMonth[key].amount += d.amount;
    totalAmount += d.amount;

    if (d.status === "won") {
      wonCount++; wonAmount += d.amount;
      byMonth[key].won++;
    } else if (d.status === "lost") {
      lostCount++;
      byMonth[key].lost++;
      const r = (d as { lossReason?: string }).lossReason || "Não informado";
      lossMap[r] = (lossMap[r] || 0) + 1;
    } else {
      byMonth[key].open++;
      openDeals.push({ id: d.id, name: d.name, amount: d.amount, stage: d.stage, closeDate: d.closeDate, probability: d.probability, pipeline: d.pipeline });
    }
  });

  const total = deals.length;
  const lossReasons: [string, number][] = Object.entries(lossMap).sort((a, b) => b[1] - a[1]);
  openDeals.sort((a, b) => b.probability - a.probability);

  const stageCounts: Record<string, number> = {};
  openDeals.forEach(d => { stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1; });
  const stageFunnel = STAGES.map(s => ({ stage: s, count: stageCounts[s] || 0 }));

  const sortedByMonth = Object.keys(byMonth).sort().reduce((o: typeof byMonth, k) => { o[k] = byMonth[k]; return o; }, {});

  return NextResponse.json({
    total,
    won: wonCount,
    lost: lostCount,
    open: openDeals.length,
    conversionRate: total ? Math.round((wonCount / total) * 1000) / 10 : 0,
    totalAmount,
    wonAmount,
    avgDealSize: total ? Math.round(totalAmount / total) : 0,
    byMonth: sortedByMonth,
    lossReasons,
    openDeals: openDeals.slice(0, 50),
    stageFunnel,
  });
}
