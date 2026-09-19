# ProofPocket — RevenueCat Shipaton Next Gen field pack

This is an owner-review draft, not a submission. Use it only if the entrant
personally verifies active-student status and a qualifying academic email. The
official rules reserve the Next Gen Award for active students and require a
public open-source repository, a sub-two-minute demo video, and no store
listing.

## Project title

ProofPocket

## One-line description

An evidence-first mobile workspace that helps independent builders keep every
opportunity, proof checkpoint, and payout conversation organized without
mistaking advertised value for confirmed revenue.

## Full description

Independent builders often have the same problem: the opportunity is in one
place, the acceptance evidence is in another, and the payment conversation is
somewhere else. ProofPocket turns that scattered record into a private,
calm workflow.

The app lets a builder record an opportunity, payer, advertised amount, status,
deadline, and dated evidence checkpoints. A clear **Ready** or **Review**
state explains whether the record has enough evidence for a payout conversation.
The overview deliberately labels money as **tracked potential** rather than
revenue, and paid/verified items are never invented. Invalid or non-positive
amounts are rejected before they affect totals.

The Pro path is guarded by a RevenueCat entitlement named `proofpocket_pro`.
This source state uses RevenueCat Test Store products only. The app labels the
flow as a sandbox purchase, makes no real charge, and keeps production keys,
store products, taxes, and payout settings owner-controlled.

## What judges can test

1. Add a local opportunity and inspect the normalized record.
2. Add an evidence checkpoint with a source and short detail.
3. Observe the Ready/Review decision and the tracked-potential total.
4. Open the Pro screen and inspect the explicitly labeled RevenueCat sandbox
   path.
5. Run the repository's validation and TypeScript checks.

## Technology and repository

- React Native 0.81 with Expo SDK 54 and TypeScript.
- `react-native-purchases` for the guarded RevenueCat integration.
- A local-first data model; no private credentials, bank data, or production
  purchase tokens are included.
- Public source repository:
  https://github.com/cuentapraces07-ops/proofpocket-shipaton-2026
- Public demo video (39.672 seconds, original scenes and male narration):
  https://vimeo.com/1228236072

## Responsible disclosure

This is a prototype. It has no claimed users, revenue, downloads, store
listing, or confirmed prize. The dashboard's monetary figures are labeled as
advertised potential. The repository and video are the evidence judges should
use; any release, eligibility, or prize claim must be verified by the owner
before submission.

## Owner-only gates before submission

- [ ] Confirm active-student status and qualifying academic email for Next Gen.
- [ ] Read and accept the current official rules personally.
- [ ] Confirm the public repository contains the open-source license.
- [ ] Confirm the public video is under two minutes and shows the app running.
- [ ] Verify the public links open without credentials.
- [ ] Submit only after checking every field and required disclosure.
