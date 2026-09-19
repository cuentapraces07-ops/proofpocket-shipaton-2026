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
const report = buildPayoutReport(base, [{ ...evidence, verified: true }]);
assert(report.markdown.includes("not a guarantee of payment") && report.verifiedEvidence === 1, "honest report");
console.log("domain.test.ts: 7 assertions passed");
