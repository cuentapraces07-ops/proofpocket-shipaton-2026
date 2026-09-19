# ProofPocket QA checklist

## Local checks completed

- [x] Opportunity amounts are finite, positive, and rounded to cents.
- [x] Paid opportunities are excluded from potential totals.
- [x] Empty or unverified evidence produces a visible review state.
- [x] Evidence title and detail are required and length-bounded.
- [x] RevenueCat is inert with placeholder keys; no accidental purchase can start.
- [x] Entitlement name is a single constant: `proofpocket_pro`.
- [x] No secrets, passwords, bank details, or personal documents are stored.
- [x] GitHub Actions Android smoke build passes and produces a reproducible unsigned `.aab`.

## Required before any external release

- [ ] Device test on Android and iOS (portrait, offline, cold start, low memory).
- [ ] VoiceOver/TalkBack labels and contrast check.
- [ ] Store privacy/data-safety declarations.
- [ ] Real RevenueCat sandbox purchase and restore-purchases test.
- [ ] Crash/analytics review with personally identifying data disabled.
- [ ] App-store listing, icon, screenshot, free trial/promo code, and demo video.
- [ ] Owner review of all legal, tax, developer-account, and payout forms.
