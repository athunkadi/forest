import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.tracking>;

export function TrackingScreen({ navigation }: Props) {
  const { gps, online } = useAppStore();
  const [tracking, setTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!tracking) {
      return;
    }

    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [tracking]);

  const distanceKm = (seconds * 0.0018).toFixed(2);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />
      <LinearGradient colors={[colors.forest, colors.canopy]} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Tracking Jalur</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.subtitle}>Rekam jalur inspeksi dengan data GPS lokal.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statusPanel}>
          <View style={[styles.statusRing, tracking && styles.statusRingActive]}>
            <Text style={styles.statusIcon}>{tracking ? "🛰️" : "🌲"}</Text>
          </View>
          <Text style={styles.statusTitle}>{tracking ? "Tracking Berjalan" : "Siap Mulai Tracking"}</Text>
          <Text style={styles.statusSubtitle}>{tracking ? "Jalur disimpan lokal hingga sinkronisasi tersedia." : "GPS aktif dan akurasi cukup untuk mulai."}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <Metric label="Durasi" value={formatDuration(seconds)} />
          <Metric label="Jarak" value={`${distanceKm} km`} />
          <Metric label="Akurasi GPS" value={`±${gps.accuracy}m`} />
          <Metric label="Elevasi" value={`${gps.altitude}m`} />
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>Lokasi Saat Ini</Text>
          <Text style={styles.locationTitle}>{gps.area}</Text>
          <Text style={styles.locationMeta}>
            {gps.block} · {gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)}
          </Text>
        </View>

        <Pressable
          style={[styles.trackButton, tracking ? styles.stopButton : styles.startButton]}
          onPress={() => setTracking((value) => !value)}
        >
          <Text style={styles.trackButtonText}>{tracking ? "■ Stop Tracking" : "▶ Mulai Tracking"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center"
  },
  backText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900"
  },
  placeholder: {
    width: 38
  },
  title: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "900"
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8
  },
  content: {
    flex: 1,
    padding: 16
  },
  statusPanel: {
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 22,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2
  },
  statusRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.mist,
    borderWidth: 10,
    borderColor: "#40916C22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14
  },
  statusRingActive: {
    backgroundColor: colors.gold,
    borderColor: "#F4A26144"
  },
  statusIcon: {
    fontSize: 38
  },
  statusTitle: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "900"
  },
  statusSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6
  },
  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10
  },
  metricCard: {
    width: "48.5%",
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  metricValue: {
    color: colors.canopy,
    fontSize: 20,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 3
  },
  locationCard: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.leaf
  },
  locationLabel: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  locationTitle: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5
  },
  locationMeta: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 4
  },
  trackButton: {
    marginTop: "auto",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center"
  },
  startButton: {
    backgroundColor: colors.leaf
  },
  stopButton: {
    backgroundColor: colors.danger
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.76
  }
});
