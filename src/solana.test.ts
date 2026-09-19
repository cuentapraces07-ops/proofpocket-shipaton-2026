import { MockDevnetWallet, RewardClaimLedger, type RewardClaimRequest, type WalletProvider } from "./solana";

const request: RewardClaimRequest = { claimId: "claim-1", evidenceId: "ev-1", amountSkr: 10 };

function assert(condition: boolean, message: string): void { if (!condition) throw new Error(message); }

(async () => {
  const ledger = new RewardClaimLedger();
  const first = await ledger.claim(new MockDevnetWallet(), request);
  assert(first.ok && first.network === "devnet", "approved devnet claim");
  const duplicate = await ledger.claim(new MockDevnetWallet(), request);
  assert(duplicate.ok === false && duplicate.reason === "duplicate-claim", "duplicate claim blocked");
  const rejected = await new RewardClaimLedger().claim(new MockDevnetWallet(false), { ...request, claimId: "claim-2" });
  assert(rejected.ok === false && rejected.reason === "wallet-rejected", "wallet rejection respected");
  const invalid = await new RewardClaimLedger().claim(new MockDevnetWallet(), { ...request, claimId: "", amountSkr: 0 });
  assert(invalid.ok === false && invalid.reason === "invalid-request", "invalid request blocked");
  const mainnetProvider: WalletProvider = {
    async connect() { return { publicKey: "11111111111111111111111111111111", network: "mainnet-beta" }; },
    async approveRewardClaim() { return { approved: true, signature: "should-not-run" }; },
  };
  const wrongNetwork = await new RewardClaimLedger().claim(mainnetProvider, { ...request, claimId: "claim-3" });
  assert(wrongNetwork.ok === false && wrongNetwork.reason === "wrong-network", "mainnet blocked by default");
  console.log("solana.test.ts: 5 assertions passed");
})();
