import Constants from "expo-constants";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { configureBilling, loadPremiumState, purchasePremium } from "./src/billing";
import { buildPayoutReport, createEvidence, calculateHealth, normalizeOpportunity, parseAmountUsd, totalPotential, type EvidenceItem, type Opportunity } from "./src/domain";

const seedOpportunities: Opportunity[] = [
  { id: "shipaton", title: "Shipaton 2026", payer: "RevenueCat", amountUsd: 100000, status: "watching", dueAt: "2026-09-30" },
  { id: "design", title: "Design category", payer: "RevenueCat", amountUsd: 20000, status: "watching", dueAt: "2026-09-30" },
];

const seedEvidence: EvidenceItem[] = [
  { id: "welcome", kind: "note", title: "Evidence-first workflow", detail: "Keep a source, decision and next action together.", createdAt: "2026-09-18T00:00:00.000Z", verified: true },
];

const revenueCatConfig = (Constants.expoConfig?.extra as { revenueCat?: { iosApiKey?: string; androidApiKey?: string } } | undefined)?.revenueCat;
const billingPlatform = Platform.OS === "ios" ? "ios" : "android";

export default function App() {
  const [tab, setTab] = useState<"home" | "evidence" | "settings">("home");
  const [opportunities, setOpportunities] = useState(seedOpportunities);
  const [evidence, setEvidence] = useState(seedEvidence);
  const [report, setReport] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPayer, setDraftPayer] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftDueAt, setDraftDueAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [billingReady, setBillingReady] = useState(false);
  const [premiumActive, setPremiumActive] = useState(false);
  const [billingMessage, setBillingMessage] = useState("Sandbox billing is not configured yet.");
  const potential = useMemo(() => totalPotential(opportunities), [opportunities]);
  const health = calculateHealth(opportunities[0]!, evidence);

  useEffect(() => {
    const key = billingPlatform === "ios" ? revenueCatConfig?.iosApiKey : revenueCatConfig?.androidApiKey;
    const configured = configureBilling(billingPlatform, key ?? "");
    setBillingReady(configured);
    if (!configured) return;
    setBillingMessage("RevenueCat sandbox connected. No real charge is enabled.");
    void loadPremiumState().then((active) => setPremiumActive(active));
  }, []);

  const addDemoEvidence = () => {
    const item = createEvidence("note", "Launch checklist", "Prototype validates local evidence capture and a clear paid tier.");
    setEvidence((previous) => [item, ...previous]);
  };

  const addOpportunity = () => {
    const amountUsd = parseAmountUsd(draftAmount);
    if (!draftTitle.trim() || !draftPayer.trim() || amountUsd <= 0) {
      setFormError("Add a title, payer and a positive USD amount.");
      return;
    }
    const next = normalizeOpportunity({
      id: `local-${Date.now()}`,
      title: draftTitle,
      payer: draftPayer,
      amountUsd,
      status: "watching",
      dueAt: draftDueAt.trim() || undefined,
    });
    setOpportunities((previous) => [next, ...previous]);
    setDraftTitle("");
    setDraftPayer("");
    setDraftAmount("");
    setDraftDueAt("");
    setFormError(null);
  };

  const tryPremiumPurchase = async () => {
    if (!billingReady) {
      setBillingMessage("Sandbox billing is unavailable until the app is built with its native module.");
      return;
    }
    setBillingMessage("Checking the RevenueCat sandbox offering...");
    const result = await purchasePremium();
    setPremiumActive(result.ok);
    setBillingMessage(result.ok ? "Sandbox entitlement active; no real charge was made." : `Sandbox purchase not completed: ${result.reason ?? "unknown reason"}.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>PROOFPOCKET</Text><Text style={styles.title}>Work with proof.</Text></View>
          <View style={styles.healthPill}><View style={[styles.dot, health !== "ready" && styles.dotWarn]} /><Text style={styles.healthText}>{health === "ready" ? "Ready" : "Review"}</Text></View>
        </View>

        {tab === "home" && <>
          <Text style={styles.subtitle}>A private evidence locker for independent builders. Track opportunities without losing the proof that makes payment possible.</Text>
          <View style={styles.heroCard}><Text style={styles.cardLabel}>TRACKED POTENTIAL</Text><Text style={styles.heroAmount}>${potential.toLocaleString("en-US", { maximumFractionDigits: 0 })}</Text><Text style={styles.muted}>Advertised, unpaid opportunities — not payment confirmation</Text></View>
          <Text style={styles.sectionTitle}>Priority opportunities</Text>
          {opportunities.map((item) => <View key={item.id} style={styles.opportunity}><View style={styles.row}><Text style={styles.opportunityTitle}>{item.title}</Text><Text style={styles.amount}>${item.amountUsd.toLocaleString()}</Text></View><Text style={styles.muted}>{item.payer} · deadline {item.dueAt}</Text><View style={styles.progressTrack}><View style={[styles.progress, { width: item.id === "shipaton" ? "38%" : "18%" }]} /></View></View>)}
          <View style={styles.formCard}>
            <Text style={styles.cardLabelDark}>ADD OPPORTUNITY</Text>
            <TextInput accessibilityLabel="Opportunity title" placeholder="Opportunity title" value={draftTitle} onChangeText={setDraftTitle} style={styles.input} />
            <TextInput accessibilityLabel="Payer" placeholder="Payer or organizer" value={draftPayer} onChangeText={setDraftPayer} style={styles.input} />
            <View style={styles.formRow}>
              <TextInput accessibilityLabel="Amount in USD" placeholder="Amount (USD)" keyboardType="decimal-pad" value={draftAmount} onChangeText={setDraftAmount} style={[styles.input, styles.halfInput]} />
              <TextInput accessibilityLabel="Deadline" placeholder="Deadline (YYYY-MM-DD)" value={draftDueAt} onChangeText={setDraftDueAt} style={[styles.input, styles.halfInput]} />
            </View>
            {formError && <Text style={styles.errorText}>{formError}</Text>}
            <TouchableOpacity accessibilityRole="button" onPress={addOpportunity} style={styles.secondary}><Text style={styles.secondaryText}>Add to private tracker</Text></TouchableOpacity>
          </View>
          <TouchableOpacity accessibilityRole="button" onPress={addDemoEvidence} style={styles.primary}><Text style={styles.primaryText}>Capture a proof checkpoint</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={() => setReport(buildPayoutReport(opportunities[0]!, evidence).markdown)} style={styles.secondary}><Text style={styles.secondaryText}>Generate payout-ready summary</Text></TouchableOpacity>
          {report && <View style={styles.reportCard}><Text style={styles.cardLabel}>TRANSPARENT HANDOFF</Text><Text style={styles.reportText}>{report}</Text></View>}
        </>}

        {tab === "evidence" && <><Text style={styles.sectionTitle}>Evidence locker</Text><Text style={styles.subtitle}>Local-first notes stay on this device until you choose to export them.</Text>{evidence.map((item) => <View style={styles.evidence} key={item.id}><View style={styles.row}><Text style={styles.evidenceKind}>{item.kind.toUpperCase()}</Text><Text style={styles.muted}>{new Date(item.createdAt).toLocaleDateString()}</Text></View><Text style={styles.opportunityTitle}>{item.title}</Text><Text style={styles.muted}>{item.detail}</Text></View>)}<TouchableOpacity accessibilityRole="button" onPress={addDemoEvidence} style={styles.secondary}><Text style={styles.secondaryText}>Add checkpoint</Text></TouchableOpacity></>}

        {tab === "settings" && <><Text style={styles.sectionTitle}>Premium controls</Text><View style={styles.settingsCard}><Text style={styles.opportunityTitle}>ProofPocket Pro</Text><Text style={styles.muted}>Unlimited evidence exports, encrypted backup and payout-ready reports. RevenueCat entitlement: proofpocket_pro.</Text><TouchableOpacity accessibilityRole="button" onPress={tryPremiumPurchase} style={styles.primary}><Text style={styles.primaryText}>{premiumActive ? "Sandbox entitlement active" : "Try sandbox purchase"}</Text></TouchableOpacity><Text style={styles.muted}>{billingMessage}</Text></View><Text style={styles.muted}>RevenueCat is configured with a public test key. Store products and real billing still require owner-controlled store setup.</Text></>}
      </ScrollView>
      <View style={styles.nav}>{(["home", "evidence", "settings"] as const).map((item) => <TouchableOpacity key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={styles.navItem}><Text style={[styles.navText, tab === item && styles.navTextActive]}>{item === "home" ? "Overview" : item === "evidence" ? "Proof" : "Pro"}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FC" }, container: { padding: 24, paddingBottom: 110, gap: 16 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { color: "#5964D8", fontSize: 12, fontWeight: "800", letterSpacing: 1.8 }, title: { color: "#121528", fontSize: 30, fontWeight: "800", marginTop: 6 }, subtitle: { color: "#69708A", fontSize: 15, lineHeight: 23 }, healthPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#E9EBFF", borderRadius: 16, paddingHorizontal: 11, paddingVertical: 8 }, dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#27AE72", marginRight: 6 }, dotWarn: { backgroundColor: "#E09B3D" }, healthText: { color: "#414AAB", fontSize: 12, fontWeight: "700" }, heroCard: { backgroundColor: "#5964D8", borderRadius: 24, padding: 24, marginTop: 6 }, cardLabel: { color: "#DDE0FF", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }, cardLabelDark: { color: "#5964D8", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }, heroAmount: { color: "#FFF", fontSize: 38, fontWeight: "800", marginTop: 10 }, muted: { color: "#788097", fontSize: 13, lineHeight: 20 }, sectionTitle: { color: "#171A2B", fontSize: 19, fontWeight: "800", marginTop: 8 }, opportunity: { backgroundColor: "#FFF", borderRadius: 18, padding: 17, gap: 9, borderWidth: 1, borderColor: "#ECEEF5" }, formCard: { backgroundColor: "#FFF", borderRadius: 18, padding: 17, gap: 10, borderWidth: 1, borderColor: "#ECEEF5" }, input: { backgroundColor: "#F7F8FC", borderWidth: 1, borderColor: "#E1E4F0", borderRadius: 11, paddingHorizontal: 12, paddingVertical: 11, color: "#22263A", fontSize: 14 }, formRow: { flexDirection: "row", gap: 10 }, halfInput: { flex: 1 }, errorText: { color: "#B44A4A", fontSize: 12 }, row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, opportunityTitle: { color: "#22263A", fontSize: 15, fontWeight: "700", flex: 1 }, amount: { color: "#252D91", fontSize: 15, fontWeight: "800" }, progressTrack: { backgroundColor: "#EEF0F7", height: 7, borderRadius: 7, overflow: "hidden" }, progress: { backgroundColor: "#5964D8", height: 7, borderRadius: 7 }, primary: { backgroundColor: "#171A2B", borderRadius: 15, padding: 16, alignItems: "center", marginTop: 4 }, primaryText: { color: "#FFF", fontWeight: "800" }, secondary: { backgroundColor: "#E9EBFF", borderRadius: 15, padding: 16, alignItems: "center" }, secondaryText: { color: "#414AAB", fontWeight: "800" }, reportCard: { backgroundColor: "#22263A", borderRadius: 18, padding: 18, gap: 10 }, reportText: { color: "#F7F8FC", fontSize: 13, lineHeight: 20 }, evidence: { backgroundColor: "#FFF", borderRadius: 18, padding: 17, gap: 8, borderWidth: 1, borderColor: "#ECEEF5" }, evidenceKind: { color: "#5964D8", fontSize: 11, fontWeight: "800", letterSpacing: 1 }, settingsCard: { backgroundColor: "#FFF", borderRadius: 18, padding: 18, gap: 12, borderWidth: 1, borderColor: "#ECEEF5" }, nav: { position: "absolute", left: 18, right: 18, bottom: 18, height: 62, borderRadius: 22, backgroundColor: "#171A2B", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }, navItem: { padding: 12 }, navText: { color: "#9EA4BB", fontWeight: "700", fontSize: 12 }, navTextActive: { color: "#FFF" },
});
