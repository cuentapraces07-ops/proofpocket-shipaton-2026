import { buildPayoutReport, calculateHealth, createEvidence, hasEntitlement, normalizeOpportunity, parseAmountUsd, totalPotential } from "./domain";

const base = { id: "a", title: " Test ", payer: " Sponsor ", amountUsd: 10.456, status: "watching" as const };

function assert(condition: boolean, message: string): void { if (!condition) throw new Error(message); }

const normalized = normalizeOpportunity(base);
assert(normalized.title === "Test" && normalized.payer === "Sponsor" && normalized.amountUsd === 10.46, "normalization");
assert(calculateHealth(base, []) === "needs-attention", "empty evidence should need attention");
const evidence = createEvidence("note", "Proof", "A clear source", new Date("2026-09-18T00:00:00.000Z"));
assert(calculateHealth(base, [{ ...evidence, verified: true }]) === "ready", "verified evidence should be ready");
assert(totalPotential([base, { ...base, id: "paid", status: "paid" }]) === 10.46, "paid items excluded");
assert(hasEntitlement({ entitlements: { active: { proofpocket_pro: {} } } }), "active entitlement");
assert(!hasEntitlement({ entitlements: { active: {} } }), "inactive entitlement");
assert(parseAmountUsd("$1,234.567") === 1234.57 && parseAmountUsd("not-money") === 0, "amount parsing");
assert(parseAmountUsd("-10") === 0 && parseAmountUsd("Infinity") === 0, "invalid amounts fail closed");
const bounded = normalizeOpportunity({ id: "bounded", title: "x".repeat(140), payer: "y".repeat(100), amountUsd: -5, status: "watching" });
assert(bounded.title.length === 120 && bounded.payer.length === 80 && bounded.amountUsd === 0, "normalized fields are bounded");
let emptyEvidenceRejected = false;
try {
  createEvidence("note", "", "detail");
} catch (error) {
  emptyEvidenceRejected = error instanceof Error && error.message === "Evidence title is required";
}
assert(emptyEvidenceRejected, "empty evidence is rejected");
const longEvidence = createEvidence("link", "x".repeat(140), "y".repeat(540), new Date("2026-09-18T00:00:00.000Z"));
assert(longEvidence.title.length === 120 && longEvidence.detail.length === 500, "evidence fields are bounded");
const report = buildPayoutReport(base, [{ ...evidence, verified: true }]);
assert(report.markdown.includes("not a guarantee of payment") && report.verifiedEvidence === 1, "honest report");
console.log("domain.test.ts: 12 assertions passed");
