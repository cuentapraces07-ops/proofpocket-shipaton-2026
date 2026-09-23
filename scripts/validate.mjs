import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Prefer the CI workspace when available. This avoids path-separator
// conversion issues in runners that execute the checkout through a Windows
// compatibility layer, while still allowing the script to run from any local
// checkout when GITHUB_WORKSPACE is absent.
const root = process.env.GITHUB_WORKSPACE || fileURLToPath(new URL("..", import.meta.url));
const required = ["LICENSE", "App.tsx", "index.js", "app.json", "package.json", "README.md", ".github/workflows/android-bundle.yml", "src/domain.ts", "src/billing.ts", "src/domain.test.ts", "src/solana.ts", "src/solana.test.ts", "docs/ARCHITECTURE.md", "docs/DEVPOST-SUBMISSION-DRAFT.md", "docs/SHIPATON-SUBMISSION-DRAFT.md", "docs/EMERGENT-BUILDERFEST-PLAN.md", "docs/EMERGENT-BUILD-PROMPT.md", "docs/OPPORTUNITY-RESEARCH-2026-09-18.md", "docs/OPPORTUNITY-RESEARCH-2026-09-21.md", "preview/index.html", "preview/styles.css", "preview/app.js", "preview/favicon.svg"];
for (const relative of required) {
  const path = join(root, relative);
  readFileSync(path, "utf8");
}
const app = readFileSync(join(root, "App.tsx"), "utf8");
const entry = readFileSync(join(root, "index.js"), "utf8");
const billing = readFileSync(join(root, "src/billing.ts"), "utf8");
const solana = readFileSync(join(root, "src/solana.ts"), "utf8");
const manifest = JSON.parse(readFileSync(join(root, "app.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const androidWorkflow = readFileSync(join(root, ".github", "workflows", "android-bundle.yml"), "utf8");
const draft = readFileSync(join(root, "docs/SHIPATON-SUBMISSION-DRAFT.md"), "utf8");
const emergent = readFileSync(join(root, "docs/EMERGENT-BUILDERFEST-PLAN.md"), "utf8");
const prompt = readFileSync(join(root, "docs/EMERGENT-BUILD-PROMPT.md"), "utf8");
const preview = readFileSync(join(root, "preview/index.html"), "utf8");
const previewScript = readFileSync(join(root, "preview/app.js"), "utf8");
const demoVideo = join(root, "video/ProofPocket-Shipaton-demo-v0.1.0.mp4");
const expandedDemoVideo = join(root, "video/ProofPocket-Shipaton-demo-v0.2.0.mp4");
const checks = [
  [manifest.expo.android.package === "com.proofpocket.app", "Android package"],
  [manifest.expo.icon === "./assets/proofpocket-icon-1024.png" && readFileSync(join(root, "assets/proofpocket-icon-1024.png"), null).length > 0, "1024px icon asset"],
  [readFileSync(demoVideo, null).length > 100000, "demo video asset"],
  [readFileSync(expandedDemoVideo, null).length > 100000, "expanded demo video asset"],
  [packageJson.main === "index.js" && entry.includes("registerRootComponent") && entry.includes("./App"), "Expo entrypoint"],
  [manifest.expo.extra.revenueCat.entitlement === "proofpocket_pro", "RevenueCat entitlement"],
  [manifest.expo.extra.revenueCat.mode === "sandbox" && manifest.expo.extra.revenueCat.androidApiKey.startsWith("test_"), "RevenueCat sandbox key"],
  ["react-native-purchases" in packageJson.dependencies, "RevenueCat dependency"],
  ["expo-constants" in packageJson.dependencies, "Expo runtime config dependency"],
  [androidWorkflow.includes("pnpm test:domain"), "CI domain test"],
  [app.includes("Capture a proof checkpoint"), "evidence action"],
  [app.includes("Add to private tracker") && app.includes("Opportunity title") && app.includes("parseAmountUsd"), "opportunity capture form"],
  [app.includes("configureBilling") && app.includes("Try sandbox purchase"), "sandbox purchase workflow"],
  [app.includes("TRACKED POTENTIAL") && app.includes("not payment confirmation"), "honest potential label"],
  [billing.includes("react-native-purchases"), "RevenueCat module"],
  [billing.includes("resolveRevenueCatModule") && billing.includes("default"), "RevenueCat module export compatibility"],
  [solana.includes("devnet") && solana.includes("duplicate-claim") && solana.includes("private keys"), "devnet-only reward guard"],
  [draft.includes("not an entry") && draft.includes("production RevenueCat products") && draft.includes("student eligibility is not assumed"), "honest submission gates"],
  [emergent.includes("Deployment alone does not count") && emergent.includes("No bots"), "contest integrity gates"],
  [prompt.includes("not a guarantee of payment") && prompt.includes("Do not invent"), "builder prompt integrity"],
  [preview.includes("Generate report") && previewScript.includes("not a guarantee of payment") && previewScript.includes("addProof"), "web preview workflow"],
];
for (const [ok, label] of checks) if (!ok) throw new Error(`failed: ${label}`);
console.log(`ProofPocket validation passed: ${checks.length} structural checks, ${readdirSync(join(root, "src")).length} source files`);
