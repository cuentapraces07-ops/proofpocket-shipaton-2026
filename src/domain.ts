export type EvidenceKind = "screenshot" | "note" | "link" | "receipt";

export type EvidenceItem = {
  id: string;
  kind: EvidenceKind;
  title: string;
  detail: string;
  createdAt: string;
  verified: boolean;
};

export type Opportunity = {
  id: string;
  title: string;
  payer: string;
  amountUsd: number;
  status: "watching" | "submitted" | "paid";
  dueAt?: string;
};

export type Health = "ready" | "needs-attention" | "incomplete";

export type PayoutReport = {
  markdown: string;
  potentialUsd: number;
  verifiedEvidence: number;
};

const finitePositive = (value: number): boolean => Number.isFinite(value) && value > 0;

export function parseAmountUsd(raw: string): number {
  const parsed = Number(raw.replace(/[$,\s]/g, ""));
  return finitePositive(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export function normalizeOpportunity(input: Opportunity): Opportunity {
  const amountUsd = finitePositive(input.amountUsd) ? Math.round(input.amountUsd * 100) / 100 : 0;
  return {
    ...input,
    title: input.title.trim().slice(0, 120),
    payer: input.payer.trim().slice(0, 80),
    amountUsd,
  };
}

export function calculateHealth(opportunity: Opportunity, evidence: readonly EvidenceItem[]): Health {
  const item = normalizeOpportunity(opportunity);
  if (!item.title || !item.payer || item.amountUsd <= 0) return "incomplete";
  if (evidence.length === 0 || evidence.some((entry) => !entry.verified)) return "needs-attention";
  return "ready";
}

export function totalPotential(opportunities: readonly Opportunity[]): number {
  return opportunities
    .map(normalizeOpportunity)
    .filter((entry) => entry.status !== "paid")
    .reduce((total, entry) => total + entry.amountUsd, 0);
}

export function createEvidence(kind: EvidenceKind, title: string, detail: string, now = new Date()): EvidenceItem {
  if (!title.trim()) throw new Error("Evidence title is required");
  if (!detail.trim()) throw new Error("Evidence detail is required");
  return {
    id: `ev_${now.getTime()}_${kind}`,
    kind,
    title: title.trim().slice(0, 120),
    detail: detail.trim().slice(0, 500),
    createdAt: now.toISOString(),
    verified: false,
  };
}

export function buildPayoutReport(opportunity: Opportunity, evidence: readonly EvidenceItem[]): PayoutReport {
  const item = normalizeOpportunity(opportunity);
  const verified = evidence.filter((entry) => entry.verified);
  const lines = [
    `# Work packet: ${item.title || "Untitled opportunity"}`,
    `Payer: ${item.payer || "Not specified"}`,
    `Potential amount: $${item.amountUsd.toFixed(2)} USD (not a guarantee of payment)`,
    `Status: ${item.status}`,
    "",
    "## Verified evidence",
    ...(verified.length === 0 ? ["- None verified yet."] : verified.map((entry) => `- ${entry.title}: ${entry.detail}`)),
    "",
    "## Next action",
    "Ask the payer to confirm acceptance, amount and payment process in writing.",
  ];
  return { markdown: lines.join("\n"), potentialUsd: item.amountUsd, verifiedEvidence: verified.length };
}

export function hasEntitlement(customerInfo: { entitlements?: { active?: Record<string, unknown> } } | null | undefined, entitlement = "proofpocket_pro"): boolean {
  return Boolean(customerInfo?.entitlements?.active && Object.prototype.hasOwnProperty.call(customerInfo.entitlements.active, entitlement));
}
