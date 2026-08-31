import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SyncBadge } from "../components/SyncBadge";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.historyDetail>;

export function HistoryDetailScreen({ navigation, route }: Props) {
  const { notes, online } = useAppStore();
  const note = notes.find((item) => item.id === route.params.noteId);

  if (!note) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBarCustom online={online} dark />
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Detail Catatan</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Catatan tidak ditemukan</Text>
          <Text style={styles.notFoundText}>Data mungkin sudah dihapus atau belum tersimpan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Detail Catatan</Text>
          <Text style={styles.headerSubtitle}>#{note.id}</Text>
        </View>
        <SyncBadge status={note.syncStatus} compact />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoPreview}>
          {note.photoUri ? (
            <Image source={{ uri: note.photoUri }} style={styles.photoImage} resizeMode="cover" />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoPlaceholderText}>Tidak ada foto</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <DetailRow label="Jenis Catatan" value={capitalize(note.category)} />
          <View style={styles.divider} />
          <DetailRow label="Kondisi Tanaman" value={note.condition} />
          <View style={styles.divider} />
          <DetailRow label="Waktu Input" value={`${formatDateTime(note.createdAt)} WIB`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lokasi Terdeteksi</Text>
          <Text style={styles.locationTitle}>{note.gps.area}</Text>
          <Text style={styles.locationSub}>{note.gps.block}</Text>
          <Text style={styles.mono}>
            {note.gps.latitude.toFixed(6)}, {note.gps.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationSub}>
            Akurasi ±{note.gps.accuracy}m · Altitude {note.gps.altitude}m
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Catatan</Text>
          <Text style={styles.notesText}>{note.notes || "Tidak ada catatan tambahan."}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    backgroundColor: colors.canopy,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
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
  headerText: {
    flex: 1
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    marginTop: 2
  },
  content: {
    padding: 16,
    paddingBottom: 30
  },
  photoPreview: {
    height: 188,
    borderRadius: 14,
    backgroundColor: "#C8DFC8",
    overflow: "hidden",
    marginBottom: 14
  },
  photoImage: {
    width: "100%",
    height: "100%"
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  photoIcon: {
    fontSize: 40
  },
  photoPlaceholderText: {
    color: colors.canopy,
    fontSize: 12,
    fontWeight: "900"
  },
  card: {
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
    marginBottom: 14,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  detailRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  detailLabel: {
    flex: 1,
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800"
  },
  detailValue: {
    flex: 1,
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgray,
    marginVertical: 8
  },
  sectionTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8
  },
  locationTitle: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: "900"
  },
  locationSub: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 3
  },
  mono: {
    color: colors.canopy,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 8
  },
  notesText: {
    color: colors.dark,
    fontSize: 13,
    lineHeight: 21
  },
  notFound: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  notFoundTitle: {
    color: colors.dark,
    fontSize: 17,
    fontWeight: "900"
  },
  notFoundText: {
    color: colors.gray,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6
  },
  pressed: {
    opacity: 0.76
  }
});
