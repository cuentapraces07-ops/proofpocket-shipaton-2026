# ProofPocket — Shipaton 2026 local prototype

Public source repository: https://github.com/cuentapraces07-ops/proofpocket-shipaton-2026

Public demo video: https://vimeo.com/1228236072

ProofPocket is a new, local-first mobile concept for independent builders: it keeps opportunity details, evidence checkpoints and payout readiness in one calm workflow. The app is intentionally separate from the existing RewardRadar web submission.

## Why this fits the opportunity

- **RevenueCat sandbox:** `src/billing.ts` configures `react-native-purchases` with the public RevenueCat Test Store key and uses the `proofpocket_pro` entitlement. The UI clearly labels this as a no-charge sandbox flow; production store keys remain owner-controlled.
- **User value:** evidence-first records reduce forgotten proof and make a future payout report easier to assemble.
- **Transparent handoff:** the prototype generates a concise report that labels potential value as *not a guarantee of payment* and asks for written payer confirmation.
- **Honest dashboard labeling:** the headline is explicitly *Tracked potential* (advertised, unpaid opportunities), never verified revenue or a promise of payment.
- **Potential categories:** RevenueCat Design and Peace Prize are realistic targets without the social-post requirement. Grand Prize requires real post-launch traction and RevenueCat revenue, so this prototype does not claim eligibility yet.
- **Privacy posture:** opportunity/evidence state stays local in the prototype. The repository contains only a public RevenueCat test key; no password, private token, card, or payout credential is included.

The dated opportunity and payout-risk evidence is kept in
`docs/OPPORTUNITY-RESEARCH-2026-09-18.md`.

## Local verification

`node scripts/validate.mjs` checks the manifest, package dependency, entitlement, explicit Expo entrypoint, and critical UI/billing paths. `src/domain.test.ts` contains seven deterministic assertions for normalization, health, totals, evidence creation, reporting, and entitlement checks.

The Android and iOS production bundles were also smoke-built with `pnpm exec expo export --platform android` and `pnpm exec expo export --platform ios`; Metro completed successfully after the project-owned `index.js` entrypoint was added. This verifies bundling only, not store submission or device QA.

The repository also includes a manual GitHub Actions workflow at
`.github/workflows/android-bundle.yml`. It runs the same structural/type checks,
generates the native Android project, and uploads an unsigned release `.aab`
artifact for the owner to sign and submit through a developer account. It does
not contain signing keys and it does not publish to a store. The latest green
run is [35411567529](https://github.com/cuentapraces07-ops/proofpocket-shipaton-2026/actions/runs/35411567529);
its downloaded `app-release.aab` is 42,010,067 bytes with SHA-256
`A39E86FAA624B70E92E28B2DE4D26F3019A62CFDD500BC72CDD2A4A1F4A8C5E3`.

The dependency-free `preview/` is a browser-testable visual slice of the same workflow. Its “Capture a proof checkpoint” and “Generate report” controls were exercised locally; the resulting report explicitly says that potential value is not a payment guarantee. The mobile build also supports adding a private opportunity with validated USD input instead of relying only on seed data.

The local `src/solana.ts` module is a dependency-free readiness boundary for
the CLOCK IN route: it accepts devnet only, requires explicit wallet approval,
blocks duplicate claims and includes a deterministic mock provider. It is not a
Solana SDK, does not create transactions and contains no wallet keys.

The submission asset set now includes a 1024×1024 store icon at
`assets/proofpocket-icon-1024.png`; it is wired into `app.json` and covered by the structural validator.

A 42-second demo video with an original low-register system narration is
linked above and is also kept at `video/ProofPocket-Shipaton-demo-v0.1.0.mp4`.
An expanded local cut with five product scenes and a clearly male neural
narration is prepared at `video/ProofPocket-Shipaton-demo-v0.2.0.mp4`; it has
not been uploaded or submitted.
It demonstrates the prototype only; it does not claim a store release, users,
revenue, prize eligibility, or guaranteed payment.

## Remaining release gates (not performed)

1. Replace the sandbox key with owner-controlled production store keys and create the production RevenueCat products/entitlement.
2. Choose Android/iOS store account and complete any required identity, tax, and payment steps personally.
3. Run Expo prebuild, device QA, accessibility checks, and store review.
4. Produce the sub-two-minute demo, 1024px icon, 1179×2556 screenshot, free trial/promo code, and English Devpost submission.

No real purchase was initiated, and no financial or payout data was entered. The public source repository and demo link above are the only published artifacts.
