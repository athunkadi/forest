import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityItem } from "../components/ActivityItem";
import { BottomNav } from "../components/BottomNav";
import { QuickActionCard } from "../components/QuickActionCard";
import { StatCard } from "../components/StatCard";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.home>;

export function HomeScreen({ navigation }: Props) {
  const { activities, gps, notes, online } = useAppStore();
  const pendingCount = notes.filter((note) => note.syncStatus !== "synced").length;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.forest, colors.canopy]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Selamat pagi,</Text>
              <Text style={styles.name}>Ahmad Fauzi 👋</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AF</Text>
            </View>
          </View>

          <View style={styles.gpsCard}>
            <Text style={styles.gpsIcon}>📡</Text>
            <Text style={styles.gpsText}>
              GPS Aktif - Akurasi <Text style={styles.gpsStrong}>±{gps.accuracy}m</Text>
            </Text>
            <View style={styles.readyBadge}>
              <Text style={styles.readyText}>SIAP</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard label="Titik Hari Ini" value="7" tone={colors.leaf} />
          <StatCard label="Belum Tersinkron" value={String(pendingCount)} tone={colors.accent} />
          <StatCard label="Total Tanaman" value={String(notes.length + 138)} tone={colors.canopy} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickGrid}>
            <QuickActionCard
              icon="📍"
              label="Catat Lokasi"
              subtitle="Tagging titik baru"
              color={colors.leaf}
              onPress={() => navigation.navigate(screens.capture)}
            />
            <QuickActionCard
              icon="🗺️"
              label="Buka Peta"
              subtitle="Lihat peta offline"
              color={colors.canopy}
              onPress={() => navigation.navigate(screens.map)}
            />
            <QuickActionCard
              icon="🛰️"
              label="Mulai Tracking"
              subtitle="Rekam jalur"
              color={colors.bark}
              onPress={() => navigation.navigate(screens.tracking)}
            />
            <QuickActionCard
              icon="↻"
              label="Sinkronisasi"
              subtitle={`${pendingCount} data pending`}
              color={colors.accent}
              onPress={() => navigation.navigate(screens.sync)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas Hari Ini</Text>
          <View style={styles.activityCard}>
            {activities.slice(0, 5).map((activity, index, list) => (
              <ActivityItem key={activity.id} activity={activity} showDivider={index < list.length - 1} />
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav active={screens.home} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  content: {
    paddingBottom: 106
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  greeting: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12
  },
  name: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 2
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.moss,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.white,
    fontWeight: "900"
  },
  gpsCard: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  gpsIcon: {
    fontSize: 16
  },
  gpsText: {
    flex: 1,
    color: colors.white,
    fontSize: 13
  },
  gpsStrong: {
    fontWeight: "900"
  },
  readyBadge: {
    backgroundColor: colors.gold,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  readyText: {
    color: colors.soil,
    fontSize: 10,
    fontWeight: "900"
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16
  },
  sectionTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  }
});
