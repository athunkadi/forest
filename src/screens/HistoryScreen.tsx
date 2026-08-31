import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { SyncBadge } from "../components/SyncBadge";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { CaptureCategory, CaptureNote, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.history>;
type Filter = "Semua" | CaptureCategory;

const filters: Filter[] = ["Semua", "tanaman", "pohon tumbang", "jejak satwa", "lainnya"];

export function HistoryScreen({ navigation }: Props) {
  const { notes, online } = useAppStore();
  const [filter, setFilter] = useState<Filter>("Semua");

  const groups = useMemo(() => {
    const visibleNotes = (filter === "Semua" ? notes : notes.filter((note) => note.category === filter)).slice();
    const grouped = visibleNotes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .reduce<Array<{ date: string; items: CaptureNote[] }>>((result, note) => {
        const date = formatDateLabel(note.createdAt);
        const existing = result.find((group) => group.date === date);
        if (existing) {
          existing.items.push(note);
          return result;
        }

        result.push({ date, items: [note] });
        return result;
      }, []);

    return grouped;
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
        {groups.length > 0 ? (
          groups.map((group) => (
            <View key={group.date} style={styles.group}>
              <Text style={styles.groupTitle}>{group.date}</Text>
              <View style={styles.listCard}>
                {group.items.map((item, index) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    last={index === group.items.length - 1}
                    onPress={() => navigation.navigate(screens.historyDetail, { noteId: item.id })}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>＋</Text>
            <Text style={styles.emptyTitle}>Belum ada catatan</Text>
            <Text style={styles.emptyText}>Data yang kamu input dari form pencatatan akan muncul di sini.</Text>
            <Pressable style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]} onPress={() => navigation.navigate(screens.capture)}>
              <Text style={styles.emptyButtonText}>Buat Catatan</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <BottomNav active={screens.history} />
    </SafeAreaView>
  );
}

function HistoryItem({ item, last, onPress }: { item: CaptureNote; last?: boolean; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.itemRow, !last && styles.divider, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.itemIcon, item.photoUri ? styles.photoIcon : styles.tagIcon]}>
        <Text style={styles.itemIconText}>{item.photoUri ? "📷" : "📍"}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {capitalize(item.category)} <Text style={styles.itemId}>#{item.id}</Text>
        </Text>
        <Text style={styles.itemMeta}>
          {item.gps.block} · {formatTime(item.createdAt)}
        </Text>
        <Text style={styles.condition}>● {item.condition}</Text>
      </View>
      <SyncBadge status={item.syncStatus} compact />
    </Pressable>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hari ini";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Kemarin";
  }

  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
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
    fontWeight: "900",
    textTransform: "capitalize"
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
  photoIcon: {
    backgroundColor: "#F4A26122"
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
  },
  emptyState: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 22,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  emptyIcon: {
    color: colors.canopy,
    fontSize: 32,
    fontWeight: "900"
  },
  emptyTitle: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 8
  },
  emptyText: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6
  },
  emptyButton: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: colors.leaf,
    paddingHorizontal: 18,
    paddingVertical: 11
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.76
  }
});
