import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { CaptureCategory, PlantCondition, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.captureForm>;

const categories: CaptureCategory[] = ["tanaman", "pohon tumbang", "jejak satwa", "lainnya"];
const conditions: Array<{ icon: string; label: PlantCondition }> = [
  { icon: "😊", label: "Baik" },
  { icon: "😐", label: "Sedang" },
  { icon: "😟", label: "Buruk" }
];

export function CaptureFormScreen({ navigation }: Props) {
  const { addCapturedNote, gps } = useAppStore();
  const [category, setCategory] = useState<CaptureCategory>("tanaman");
  const [condition, setCondition] = useState<PlantCondition>("Baik");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) {
      return;
    }

    setSaving(true);
    const saved = await addCapturedNote({ category, condition, notes });
    setSaving(false);
    navigation.replace(screens.captureSuccess, { noteId: saved.id });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detail Catatan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoPreview}>
          {/* TODO: Persist real image files with expo-file-system after camera capture is enabled. */}
          <Text style={styles.photoIcon}>📷</Text>
          <View style={styles.photoMeta}>
            <Text style={styles.photoMetaText}>
              {gps.latitude.toFixed(4)}° | {gps.longitude.toFixed(4)}° · 10:44 WIB
            </Text>
          </View>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>Lokasi Terdeteksi</Text>
            <Text style={styles.mono}>
              {gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)} · ±{gps.accuracy}m
            </Text>
            <Text style={styles.locationSub}>
              {gps.area} · {gps.block}
            </Text>
          </View>
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>GPS ✓</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Jenis Catatan</Text>
          <View style={styles.chipRow}>
            {categories.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, category === item && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Catatan Opsional</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambah deskripsi kondisi lapangan..."
            placeholderTextColor={colors.gray}
            multiline
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Kondisi Tanaman</Text>
          <View style={styles.conditionRow}>
            {conditions.map((item) => {
              const active = condition === item.label;
              return (
                <Pressable
                  key={item.label}
                  style={[styles.conditionCard, active && styles.conditionActive]}
                  onPress={() => setCondition(item.label)}
                >
                  <Text style={styles.conditionIcon}>{item.icon}</Text>
                  <Text style={styles.conditionText}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [pressed && styles.pressed]} onPress={handleSave}>
          <LinearGradient colors={[colors.leaf, colors.canopy]} style={styles.saveButton}>
            <Text style={styles.saveText}>{saving ? "Menyimpan..." : "✓ Simpan Catatan"}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 16,
    backgroundColor: colors.canopy,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  backText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800"
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  content: {
    padding: 16,
    paddingBottom: 104
  },
  photoPreview: {
    height: 146,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.leaf,
    backgroundColor: "#C8DFC8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden"
  },
  photoIcon: {
    fontSize: 42
  },
  photoMeta: {
    position: "absolute",
    left: 8,
    bottom: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  photoMetaText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700"
  },
  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  locationIcon: {
    fontSize: 24
  },
  locationContent: {
    flex: 1
  },
  locationTitle: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900"
  },
  mono: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "700"
  },
  locationSub: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  },
  gpsBadge: {
    borderRadius: 20,
    backgroundColor: colors.mist,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  gpsBadgeText: {
    color: colors.canopy,
    fontSize: 10,
    fontWeight: "900"
  },
  field: {
    marginBottom: 14
  },
  label: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 7
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: colors.canopy,
    borderColor: colors.canopy
  },
  chipText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  chipTextActive: {
    color: colors.white
  },
  notesInput: {
    minHeight: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.dark,
    fontSize: 13
  },
  conditionRow: {
    flexDirection: "row",
    gap: 8
  },
  conditionCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightgray,
    backgroundColor: colors.white,
    paddingVertical: 10,
    alignItems: "center"
  },
  conditionActive: {
    borderColor: colors.leaf,
    backgroundColor: colors.mist
  },
  conditionIcon: {
    fontSize: 22
  },
  conditionText: {
    color: colors.dark,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightgray
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center"
  },
  saveText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.78
  }
});
