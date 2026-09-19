import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/+([A-Z]:)/, "$1").replaceAll("/", "\\");
const required = ["App.tsx", "index.js", "app.json", "package.json", "README.md", "src\\domain.ts", "src\\billing.ts", "src\\domain.test.ts", "docs\\SHIPATON-SUBMISSION-DRAFT.md", "docs\\EMERGENT-BUILDERFEST-PLAN.md", "docs\\EMERGENT-BUILD-PROMPT.md", "docs\\OPPORTUNITY-RESEARCH-2026-09-18.md", "preview\\index.html", "preview\\styles.css", "preview\\app.js", "preview\\favicon.svg"];
for (const relative of required) {
  const path = join(root, relative);
  readFileSync(path, "utf8");
}
const app = readFileSync(join(root, "App.tsx"), "utf8");
const entry = readFileSync(join(root, "index.js"), "utf8");
const billing = readFileSync(join(root, "src\\billing.ts"), "utf8");
const manifest = JSON.parse(readFileSync(join(root, "app.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const draft = readFileSync(join(root, "docs\\SHIPATON-SUBMISSION-DRAFT.md"), "utf8");
const emergent = readFileSync(join(root, "docs\\EMERGENT-BUILDERFEST-PLAN.md"), "utf8");
const prompt = readFileSync(join(root, "docs\\EMERGENT-BUILD-PROMPT.md"), "utf8");
const preview = readFileSync(join(root, "preview\\index.html"), "utf8");
const previewScript = readFileSync(join(root, "preview\\app.js"), "utf8");
const demoVideo = join(root, "video\\ProofPocket-Shipaton-demo-v0.1.0.mp4");
const checks = [
  [manifest.expo.android.package === "com.proofpocket.app", "Android package"],
  [manifest.expo.icon === "./assets/proofpocket-icon-1024.png" && readFileSync(join(root, "assets\\proofpocket-icon-1024.png"), null).length > 0, "1024px icon asset"],
  [readFileSync(demoVideo, null).length > 100000, "demo video asset"],
  [packageJson.main === "index.js" && entry.includes("registerRootComponent") && entry.includes("./App"), "Expo entrypoint"],
  [manifest.expo.extra.revenueCat.entitlement === "proofpocket_pro", "RevenueCat entitlement"],
  [manifest.expo.extra.revenueCat.mode === "sandbox" && manifest.expo.extra.revenueCat.androidApiKey.startsWith("test_"), "RevenueCat sandbox key"],
  ["react-native-purchases" in packageJson.dependencies, "RevenueCat dependency"],
  ["expo-constants" in packageJson.dependencies, "Expo runtime config dependency"],
  [app.includes("Capture a proof checkpoint"), "evidence action"],
  [app.includes("Add to private tracker") && app.includes("Opportunity title") && app.includes("parseAmountUsd"), "opportunity capture form"],
  [app.includes("configureBilling") && app.includes("Try sandbox purchase"), "sandbox purchase workflow"],
  [app.includes("TRACKED POTENTIAL") && app.includes("not payment confirmation"), "honest potential label"],
  [billing.includes("react-native-purchases"), "RevenueCat module"],
  [draft.includes("not an entry") && draft.includes("production RevenueCat products") && draft.includes("student eligibility is not assumed"), "honest submission gates"],
  [emergent.includes("Deployment alone does not count") && emergent.includes("No bots"), "contest integrity gates"],
  [prompt.includes("not a guarantee of payment") && prompt.includes("Do not invent"), "builder prompt integrity"],
  [preview.includes("Generate report") && previewScript.includes("not a guarantee of payment") && previewScript.includes("addProof"), "web preview workflow"],
];
for (const [ok, label] of checks) if (!ok) throw new Error(`failed: ${label}`);
console.log(`ProofPocket validation passed: ${checks.length} structural checks, ${readdirSync(join(root, "src")).length} source files`);
