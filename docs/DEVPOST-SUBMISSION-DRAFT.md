# Devpost submission draft (owner review required)

This document is a prepared draft only. It must not be submitted until the
owner has verified the store URL, release date, production RevenueCat products,
and every eligibility answer.

## Title

ProofPocket

## Tagline

Turn scattered work evidence into a calm, honest path to payout readiness.

## Description

Independent builders often have the work, but not the evidence trail that makes
the next payment conversation easy. ProofPocket is a local-first mobile app for
tracking opportunities, dated evidence checkpoints, and the difference between
advertised potential and a confirmed payment.

An opportunity records its payer, amount, deadline, and state. Evidence
checkpoints capture a short source and detail with a timestamp. The app then
shows a clear `Ready` or `Review` signal and generates a concise report for a
human payer conversation. Paid opportunities are excluded from the tracked
potential total, and invalid or non-positive amounts are rejected before they
can affect totals.

The Pro path is deliberately guarded by RevenueCat. The current prototype uses
RevenueCat Test Store products and the `proofpocket_pro` entitlement; it does
not contain a card, secret key, production product, or payout credential. The
code supports both native RevenueCat module export shapes and clears a stale
client after a failed reconfiguration, so a previous session cannot silently
be reused.

## What to test

1. Add an opportunity and verify the USD amount is normalized.
2. Add a dated evidence checkpoint and inspect the Ready/Review state.
3. Generate the report and confirm it says tracked potential is not a payment
   guarantee.
4. Open Pro and run only the RevenueCat Test Store sandbox path.

## Links

- Source: https://github.com/cuentapraces07-ops/proofpocket-shipaton-2026
- Prototype demo: https://vimeo.com/1228236072

## Eligibility and release gates

The repository and demo describe a prototype. A final entry must be updated
with a real first store release during the Shipaton window, an accessible store
URL, production RevenueCat products/keys, device QA, and the owner’s verified
eligibility and payout information. No such claim is made by this draft.
