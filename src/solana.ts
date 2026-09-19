export type SolanaNetwork = "devnet" | "mainnet-beta";

export type WalletSession = {
  publicKey: string;
  network: SolanaNetwork;
};

export type RewardClaimRequest = {
  claimId: string;
  evidenceId: string;
  amountSkr: number;
};

export type RewardClaimResult =
  | { ok: true; claimId: string; signature: string; network: "devnet" }
  | { ok: false; reason: "invalid-request" | "wallet-rejected" | "wrong-network" | "duplicate-claim" };

export type WalletProvider = {
  connect(): Promise<WalletSession>;
  approveRewardClaim(request: RewardClaimRequest, session: WalletSession): Promise<{ approved: boolean; signature?: string }>;
};

const PUBLIC_KEY_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function validRequest(request: RewardClaimRequest): boolean {
  return Boolean(
    request.claimId.trim()
      && request.evidenceId.trim()
      && Number.isFinite(request.amountSkr)
      && request.amountSkr > 0,
  );
}

/**
 * A local-first guard around a future Mobile Wallet Adapter integration.
 * It deliberately accepts devnet only and never stores private keys.
 */
export class RewardClaimLedger {
  private readonly claimed = new Set<string>();

  async claim(provider: WalletProvider, request: RewardClaimRequest): Promise<RewardClaimResult> {
    if (!validRequest(request) || this.claimed.has(request.claimId)) {
      return { ok: false, reason: this.claimed.has(request.claimId) ? "duplicate-claim" : "invalid-request" };
    }
    const session = await provider.connect();
    if (session.network !== "devnet" || !PUBLIC_KEY_PATTERN.test(session.publicKey)) {
      return { ok: false, reason: "wrong-network" };
    }
    const approval = await provider.approveRewardClaim(request, session);
    if (!approval.approved || !approval.signature?.trim()) {
      return { ok: false, reason: "wallet-rejected" };
    }
    this.claimed.add(request.claimId);
    return { ok: true, claimId: request.claimId, signature: approval.signature, network: "devnet" };
  }
}

/** Deterministic mock for tests and demos; it performs no network request. */
export class MockDevnetWallet implements WalletProvider {
  constructor(private readonly approved = true) {}

  async connect(): Promise<WalletSession> {
    return { publicKey: "11111111111111111111111111111111", network: "devnet" };
  }

  async approveRewardClaim(request: RewardClaimRequest): Promise<{ approved: boolean; signature?: string }> {
    return this.approved ? { approved: true, signature: `mock_${request.claimId}` } : { approved: false };
  }
}
