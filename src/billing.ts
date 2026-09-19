import { hasEntitlement } from "./domain";

export const PRO_ENTITLEMENT = "proofpocket_pro";

type RevenueCatModule = {
  configure: (options: { apiKey: string }) => void;
  getOfferings: () => Promise<{ current?: { availablePackages?: Array<{ identifier: string }> } }>;
  purchasePackage: (pkg: unknown) => Promise<{ customerInfo: unknown }>;
  getCustomerInfo: () => Promise<unknown>;
};

let purchases: RevenueCatModule | null = null;

/** Configure only with public RevenueCat keys supplied by the account owner. */
export function configureBilling(platform: "ios" | "android", apiKey: string): boolean {
  if (!apiKey || apiKey.startsWith("REPLACE_WITH_")) return false;
  // Kept behind a guarded require so the local prototype can run without store credentials.
  // The production build uses react-native-purchases via Expo prebuild.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require("react-native-purchases") as RevenueCatModule;
    module.configure({ apiKey });
    purchases = module;
    void platform;
    return true;
  } catch {
    purchases = null;
    return false;
  }
}

export async function loadPremiumState(): Promise<boolean> {
  const client = purchases;
  if (!client) return false;
  try {
    const info = await client.getCustomerInfo();
    return hasEntitlement(info as { entitlements?: { active?: Record<string, unknown> } }, PRO_ENTITLEMENT);
  } catch {
    return false;
  }
}

export async function purchasePremium(): Promise<{ ok: boolean; reason?: string }> {
  const client = purchases;
  if (!client) return { ok: false, reason: "billing-not-configured" };
  try {
    const offerings = await client.getOfferings();
    const first = offerings.current?.availablePackages?.[0];
    if (!first) return { ok: false, reason: "no-offering" };
    await client.purchasePackage(first);
    return { ok: await loadPremiumState() };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "purchase-failed" };
  }
}
