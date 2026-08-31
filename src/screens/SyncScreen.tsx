import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { SyncBadge } from "../components/SyncBadge";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { CaptureNote } from "../types";

export function SyncScreen() {
  const { isSyncing, notes, online, syncPendingRecords, toggleOnline } = useAppStore();
  const pending = notes.filter((note) => note.syncStatus !== "synced");
  const syncedCount = notes.filter((note) => note.syncStatus === "synced").length;
  const lastSync = useMemo(() => {
    if (notes.length === 0) {
      return "Belum ada data";
    }

    return pending.length === 0 ? "Semua sinkron" : "Menunggu";
  }, [notes.length, pending.length]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />
      <View style={styles.header}>
        <Text style={styles.title}>Sinkronisasi Data</Text>
        <Text style={styles.subtitle}>{online ? "Koneksi tersedia - siap kirim data" : "Tidak ada koneksi internet"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={[styles.statusCard, online ? styles.onlineCard : styles.offlineCard]} onPress={toggleOnline}>
          <Text style={styles.statusIcon}>{online ? "✅" : "⚠️"}</Text>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>{online ? "Internet Tersedia" : "Mode Offline"}</Text>
            <Text style={styles.statusSubtitle}>
              {online ? `${pending.length} data siap dikirim ke server` : "Data tersimpan, tunggu koneksi"}
            </Text>
          </View>
          <Text style={styles.toggleHint}>ubah</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Menunggu Dikirim ({pending.length})</Text>
        <View style={styles.pendingCard}>
          {pending.length > 0 ? (
            pending.map((item, index) => <PendingItem key={item.id} item={item} last={index === pending.length - 1} />)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={styles.emptyText}>Semua data sudah tersinkron.</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <SyncStat label="✅ Terkirim" value={`${syncedCount} data`} color={colors.leaf} />
          <SyncStat label="📦 Lokal" value={`${pending.length} pending`} color={colors.accent} />
          <SyncStat label="📅 Terakhir Sync" value={lastSync} color={colors.canopy} />
          <SyncStat label="📶 Server" value={online ? "Normal" : "Menunggu"} color={online ? colors.leaf : colors.accent} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!online || isSyncing || pending.length === 0}
          style={[
            styles.syncButton,
            (!online || pending.length === 0) && styles.syncButtonDisabled,
            isSyncing && styles.syncButtonLoading
          ]}
          onPress={syncPendingRecords}
        >
          <Text style={[styles.syncText, (!online || pending.length === 0) && styles.syncTextDisabled]}>
            {isSyncing ? "⏳ Mengirim data..." : pending.length === 0 ? "✓ Sinkronisasi Selesai" : "↑ Sinkronkan Sekarang"}
          </Text>
        </Pressable>
      </View>

      <BottomNav active={screens.sync} />
    </SafeAreaView>
  );
}

function PendingItem({ item, last }: { item: CaptureNote; last?: boolean }) {
  return (
    <View style={[styles.pendingRow, !last && styles.divider]}>
      <View style={styles.pendingIcon}>
        <Text style={styles.pendingIconText}>📷</Text>
      </View>
      <View style={styles.pendingContent}>
        <Text style={styles.pendingTitle}>
          {capitalize(item.category)} <Text style={styles.pendingId}>#{item.id}</Text>
        </Text>
        <Text style={styles.pendingMeta}>
          {formatTime(item.createdAt)} · {item.photoUri ? "dengan foto" : "tanpa foto"}
        </Text>
      </View>
      <SyncBadge status={item.syncStatus} compact />
    </View>
  );
}

function SyncStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  header: {
    backgroundColor: colors.canopy,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24
  },
  title: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "900"
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 5
  },
  content: {
    padding: 16,
    paddingBottom: 178
  },
  statusCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  onlineCard: {
    backgroundColor: colors.mist,
    borderColor: colors.leaf
  },
  offlineCard: {
    backgroundColor: "#FFEEDD",
    borderColor: colors.accent
  },
  statusIcon: {
    fontSize: 20
  },
  statusContent: {
    flex: 1
  },
  statusTitle: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900"
  },
  statusSubtitle: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  },
  toggleHint: {
    color: colors.gray,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  sectionTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8
  },
  pendingCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray
  },
  pendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center"
  },
  pendingIconText: {
    fontSize: 18
  },
  pendingContent: {
    flex: 1
  },
  pendingTitle: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900"
  },
  pendingId: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "600"
  },
  pendingMeta: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  },
  emptyState: {
    padding: 24,
    alignItems: "center"
  },
  emptyIcon: {
    color: colors.leaf,
    fontSize: 26,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 6
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10
  },
  statBox: {
    width: "48.5%",
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  statLabel: {
    color: colors.gray,
    fontSize: 11
  },
  statValue: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 82,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightgray
  },
  syncButton: {
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: colors.leaf,
    alignItems: "center"
  },
  syncButtonLoading: {
    backgroundColor: colors.moss
  },
  syncButtonDisabled: {
    backgroundColor: colors.lightgray
  },
  syncText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  syncTextDisabled: {
    color: colors.gray
  }
});
