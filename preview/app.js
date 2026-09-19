const opportunities = [
  { title: "Shipaton 2026", payer: "RevenueCat", amount: 100000, due: "Sep 30", progress: 38 },
  { title: "Frankfurter fix", payer: "BasedHardware / Omi", amount: 125, due: "Merged", progress: 92 },
];
const evidence = [
  { kind: "VERIFIED NOTE", title: "Acceptance condition", detail: "Keep potential value separate from confirmed payment.", date: "Today" },
  { kind: "VERIFIED LINK", title: "Source captured", detail: "Public issue, requirements and test output are traceable.", date: "Today" },
];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);

function renderOpportunities() {
  $("opportunityList").innerHTML = opportunities.map((item) => `
    <article class="opportunity"><div class="row"><span class="opportunity-title">${item.title}</span><span class="amount">${money.format(item.amount)}</span></div>
    <p class="meta">${item.payer} · ${item.due}</p><div class="track" aria-label="Evidence progress ${item.progress}%"><span style="width:${item.progress}%"></span></div></article>`).join("");
}
function renderEvidence() {
  $("evidenceList").innerHTML = evidence.map((item) => `<article class="evidence"><div class="evidence-top"><span>${item.kind}</span><time>${item.date}</time></div><h3>${item.title}</h3><p>${item.detail}</p></article>`).join("");
  $("evidenceCount").textContent = `${evidence.length}/3`;
}
function addCheckpoint() {
  evidence.unshift({ kind: "NEW CHECKPOINT", title: "Launch readiness", detail: "A local QA pass completed with deterministic tests and no store credentials.", date: "Now" });
  $("healthLabel").textContent = "Ready for handoff";
  $("healthDetail").textContent = "Three evidence checkpoints captured";
  renderEvidence();
}
function generateReport() {
  const report = [
    "# Work packet: ProofPocket",
    "Payer: RevenueCat / opportunity tracker",
    "Potential amount: $100000.00 USD (not a guarantee of payment)",
    "Status: watching",
    "",
    "## Verified evidence",
    ...evidence.map((item) => `- ${item.title}: ${item.detail}`),
    "",
    "## Next action",
    "Ask the payer to confirm acceptance, amount and payment process in writing.",
  ].join("\n");
  const output = $("report"); output.hidden = false; output.textContent = report; output.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
renderOpportunities(); renderEvidence();
$("addProof").addEventListener("click", addCheckpoint);
$("generateReport").addEventListener("click", generateReport);
$("addOpportunity").addEventListener("click", () => window.alert("Demo mode: create-opportunity form is intentionally not connected to a network."));
