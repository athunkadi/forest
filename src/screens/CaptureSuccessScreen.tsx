import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.captureSuccess>;

export function CaptureSuccessScreen({ navigation, route }: Props) {
  const { notes, gps } = useAppStore();
  const note = notes.find((item) => item.id === route.params?.noteId);
  const summaryGps = note?.gps ?? gps;
  const capturedAt = note?.createdAt ? new Date(note.createdAt) : new Date();
  const capturedTime = capturedAt.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <LinearGradient colors={[colors.forest, colors.canopy]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Data Tersimpan!</Text>
        <Text style={styles.subtitle}>Catatan disimpan di perangkat. Akan otomatis terkirim saat ada internet.</Text>

        <View style={styles.summaryCard}>
          <SummaryRow icon="📍" label="Koordinat" value={`${summaryGps.latitude.toFixed(6)}, ${summaryGps.longitude.toFixed(6)}`} />
          <SummaryRow icon="🕙" label="Waktu" value={`${capturedTime} WIB`} />
          <SummaryRow icon="📷" label="Foto" value={note?.photoUri ? "Tersimpan" : "Tidak tersedia"} />
          <SummaryRow icon="📂" label="Status" value={note?.syncStatus === "pending" ? "Tersimpan lokal" : "Tersinkron"} />
        </View>

        <View style={styles.actionRow}>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={() => navigation.replace(screens.capture)}>
            <Text style={styles.secondaryText}>＋ Catat Lagi</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={() => navigation.replace(screens.home)}>
            <Text style={styles.primaryText}>Ke Beranda</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  safe: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  successCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 12,
    borderColor: "rgba(255,255,255,0.08)"
  },
  successIcon: {
    color: colors.white,
    fontSize: 44,
    fontWeight: "900"
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 9
  },
  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 30
  },
  summaryCard: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5
  },
  summaryIcon: {
    fontSize: 15
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 12
  },
  summaryValue: {
    flex: 1,
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right"
  },
  actionRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 14,
    alignItems: "center"
  },
  secondaryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900"
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.gold,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryText: {
    color: colors.soil,
    fontSize: 14,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.78
  }
});
