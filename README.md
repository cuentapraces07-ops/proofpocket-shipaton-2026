# ProofPocket — Shipaton 2026 local prototype

ProofPocket is a new, local-first mobile concept for independent builders: it keeps opportunity details, evidence checkpoints and payout readiness in one calm workflow. The app is intentionally separate from the existing RewardRadar web submission.

## Why this fits the opportunity

- **RevenueCat integration point:** `src/billing.ts` configures `react-native-purchases` and uses the `proofpocket_pro` entitlement. It refuses to initialize until real public store keys are supplied.
- **User value:** evidence-first records reduce forgotten proof and make a future payout report easier to assemble.
- **Transparent handoff:** the prototype generates a concise report that labels potential value as *not a guarantee of payment* and asks for written payer confirmation.
- **Honest dashboard labeling:** the headline is explicitly *Tracked potential* (advertised, unpaid opportunities), never verified revenue or a promise of payment.
- **Potential categories:** RevenueCat Design and Peace Prize are realistic targets without the social-post requirement. Grand Prize requires real post-launch traction and RevenueCat revenue, so this prototype does not claim eligibility yet.
- **Privacy posture:** no network or account is used by the prototype; the first version keeps demo state in memory and has no credentials.

The dated opportunity and payout-risk evidence is kept in
`docs/OPPORTUNITY-RESEARCH-2026-09-18.md`.

## Local verification

`node scripts/validate.mjs` checks the manifest, package dependency, entitlement, explicit Expo entrypoint, and critical UI/billing paths. `src/domain.test.ts` contains seven deterministic assertions for normalization, health, totals, evidence creation, reporting, and entitlement checks.

The Android and iOS production bundles were also smoke-built with `pnpm exec expo export --platform android` and `pnpm exec expo export --platform ios`; Metro completed successfully after the project-owned `index.js` entrypoint was added. This verifies bundling only, not store submission or device QA.

The dependency-free `preview/` is a browser-testable visual slice of the same workflow. Its “Capture a proof checkpoint” and “Generate report” controls were exercised locally; the resulting report explicitly says that potential value is not a payment guarantee. The mobile build also supports adding a private opportunity with validated USD input instead of relying only on seed data.

The submission asset set now includes a 1024×1024 store icon at
`assets/proofpocket-icon-1024.png`; it is wired into `app.json` and covered by the structural validator.

A 42-second local demo video with an original low-register system narration is
at `video/ProofPocket-Shipaton-demo-v0.1.0.mp4`. It is not uploaded or claimed
as public; the owner must review it and publish it only after the app is truly
released and the remaining eligibility gates are satisfied.

## Remaining release gates (not performed)

1. Create the owner’s RevenueCat project and replace the two public API-key placeholders.
2. Choose Android/iOS store account and complete any required identity, tax, and payment steps personally.
3. Run Expo prebuild, device QA, accessibility checks, and store review.
4. Produce the sub-two-minute demo, 1024px icon, 1179×2556 screenshot, free trial/promo code, and English Devpost submission.

No account was created, no purchase was initiated, and nothing was published from this local prototype.
