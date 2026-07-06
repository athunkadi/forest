import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { SyncBadge } from "../components/SyncBadge";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { mockGps } from "../data/mockData";
import { useAppStore } from "../store/useAppStore";
import { CaptureNote } from "../types";

type Filter = "Semua" | "Tagging" | "Track" | "Foto";

const filters: Filter[] = ["Semua", "Tagging", "Track", "Foto"];

export function HistoryScreen() {
  const { notes, online } = useAppStore();
  const [filter, setFilter] = useState<Filter>("Semua");

  const groups = useMemo(() => {
    const visibleNotes = filter === "Semua" || filter === "Tagging" || filter === "Foto" ? notes : [];
    return [
      { date: "Hari ini", items: visibleNotes.filter((note) => note.createdAt.startsWith("2026-05-01") || note.id > "TG-0044") },
      { date: "Kemarin", items: visibleNotes.filter((note) => note.createdAt.startsWith("2026-04-30")) }
    ].filter((group) => group.items.length > 0);
  }, [filter, notes]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Catatan</Text>
        <View style={styles.filterRow}>
          {filters.map((item) => {
            const active = filter === item;
            return (
              <Pressable key={item} style={[styles.filterChip, active && styles.filterActive]} onPress={() => setFilter(item)}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filter === "Track" ? (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Kemarin</Text>
            <View style={styles.listCard}>
              <HistoryItem
                item={{
                  id: "TR-0010",
                  category: "lainnya",
                  notes: "Tracking jalur inspeksi utara.",
                  condition: "Baik",
                  gps: notes[0]?.gps ?? mockGps,
                  createdAt: "2026-04-30T08:00:00.000Z",
                  syncStatus: "synced"
                }}
                track
                last
              />
            </View>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.date} style={styles.group}>
              <Text style={styles.groupTitle}>{group.date}</Text>
              <View style={styles.listCard}>
                {group.items.map((item, index) => (
                  <HistoryItem key={item.id} item={item} last={index === group.items.length - 1} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNav active={screens.history} />
    </SafeAreaView>
  );
}

function HistoryItem({ item, last, track = false }: { item: CaptureNote; last?: boolean; track?: boolean }) {
  return (
    <View style={[styles.itemRow, !last && styles.divider]}>
      <View style={[styles.itemIcon, track ? styles.trackIcon : styles.tagIcon]}>
        <Text style={styles.itemIconText}>{track ? "🛰️" : "📍"}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {track ? "Track" : "Tagging"} <Text style={styles.itemId}>#{item.id}</Text>
        </Text>
        <Text style={styles.itemMeta}>
          {track ? "Jalur Utara · 08:00-10:00" : `${item.gps.block} · ${formatTime(item.createdAt)}`}
        </Text>
        {!track ? <Text style={styles.condition}>● {item.condition}</Text> : null}
      </View>
      <SyncBadge status={item.syncStatus} compact />
    </View>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 13
  },
  filterChip: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  filterActive: {
    backgroundColor: colors.gold
  },
  filterText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 11,
    fontWeight: "900"
  },
  filterTextActive: {
    color: colors.soil
  },
  content: {
    padding: 16,
    paddingBottom: 106
  },
  group: {
    marginBottom: 16
  },
  groupTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8
  },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  itemRow: {
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
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  tagIcon: {
    backgroundColor: "#40916C22"
  },
  trackIcon: {
    backgroundColor: "#6B422622"
  },
  itemIconText: {
    fontSize: 18
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900"
  },
  itemId: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "600"
  },
  itemMeta: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  },
  condition: {
    color: colors.leaf,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2
  }
});
