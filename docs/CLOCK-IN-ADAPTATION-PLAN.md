# CLOCK IN adaptation plan — local design only

This document is a feasibility plan for the official Solana Mobile CLOCK IN
hackathon. It is not a registration or submission and does not claim a working
Solana integration.

## Product direction

ProofPocket can become a Seeker-first opportunity and evidence wallet: local
proof checkpoints remain private, while an optional wallet connection lets a
builder claim a small, user-approved SKR reward for completing an evidence
milestone. The app must never treat a wallet balance or advertised bounty as
income, and reward claims must be explicit, reversible where the protocol
allows it, and shown with the network and transaction status.

## Official submission gates to satisfy

- functional Android APK;
- public source repository;
- demo video showing the app in use;
- short pitch deck;
- if selected, later publication in the Solana dApp Store to claim the prize.

## Safe implementation sequence

1. Add a wallet adapter boundary with a mock provider for local tests; keep the
   app fully usable without a wallet.
2. Add a devnet-only reward preview and a transaction-confirmation screen. Do
   not ship a private key or use a mainnet endpoint in source.
3. Add tests for rejected network mismatches, cancelled approvals, duplicate
   reward claims and malformed transaction responses.
4. Build an Android artifact and record a truthful demo showing the mock path
   unless a real devnet integration has been independently verified.
5. Confirm the current hackathon rules and owner-controlled wallet/account
   requirements before any registration or submission.

## Current status

The existing ProofPocket build has RevenueCat Test Store billing, an Android
bundle workflow and a public demo. It now also has a dependency-free,
devnet-only reward-claim guard with a deterministic mock provider and tests;
this is **not** a Solana SDK, wallet adapter, SKR contract or devnet
transaction. Those missing pieces are deliberate; no claim of CLOCK IN
eligibility has been made.
