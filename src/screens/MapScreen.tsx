import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.map>;
type Layer = "topo" | "satelit";

const pins = [
  { left: "35%", top: "26%", color: colors.leaf },
  { left: "45%", top: "35%", color: colors.leaf },
  { left: "31%", top: "43%", color: colors.leaf },
  { left: "72%", top: "30%", color: colors.accent }
] as const;

export function MapScreen({ navigation }: Props) {
  const [layer, setLayer] = useState<Layer>("topo");
  const { online } = useAppStore();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} />
      {/* TODO: Replace this simulated map with cached offline tiles and real polygon layers. */}
      <View style={[styles.mapBase, layer === "satelit" && styles.satelliteBase]}>
        {Array.from({ length: 9 }).map((_, index) => (
          <View key={`h-${index}`} style={[styles.gridLineH, { top: `${index * 12}%` }]} />
        ))}
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={`v-${index}`} style={[styles.gridLineV, { left: `${index * 16}%` }]} />
        ))}

        <View style={[styles.contour, styles.contourOne]} />
        <View style={[styles.contour, styles.contourTwo]} />
        <View style={[styles.contour, styles.contourThree]} />

        <View style={[styles.polygon, styles.polygonA]}>
          <Text style={styles.polygonText}>Blok A</Text>
        </View>
        <View style={[styles.polygon, styles.polygonB]}>
          <Text style={styles.polygonText}>Blok B</Text>
        </View>

        {pins.map((pin, index) => (
          <View key={index} style={[styles.pinWrap, { left: pin.left, top: pin.top }]}>
            <View style={[styles.pin, { backgroundColor: pin.color }]} />
          </View>
        ))}

        <View style={styles.currentLocation}>
          <View style={styles.currentPulse} />
          <View style={styles.currentDot} />
        </View>
      </View>

      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Cari lokasi..."
            placeholderTextColor={colors.gray}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
        <Pressable style={({ pressed }) => [styles.squareButton, pressed && styles.pressed]}>
          <Text style={styles.squareButtonText}>🧭</Text>
        </Pressable>
      </View>

      <View style={styles.layerToggle}>
        {(["topo", "satelit"] as const).map((item) => (
          <Pressable
            key={item}
            style={[styles.layerButton, layer === item && styles.layerActive]}
            onPress={() => setLayer(item)}
          >
            <Text style={[styles.layerText, layer === item && styles.layerTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.compass}>
        <Text style={styles.compassText}>N</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Kawasan Hutan Lindung Blok A</Text>
          <Text style={styles.activeText}>● Aktif</Text>
        </View>
        <View style={styles.infoMetaRow}>
          <Text style={styles.infoMeta}>📍 4 titik hari ini</Text>
          <Text style={styles.infoMeta}>📐 245 ha</Text>
          <Text style={styles.infoMeta}>🌿 Topo offline ✓</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]} onPress={() => navigation.navigate(screens.capture)}>
          <Text style={styles.ctaText}>＋ Catat Titik di Sini</Text>
        </Pressable>
      </View>

      <BottomNav active={screens.map} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offwhite
  },
  mapBase: {
    ...StyleSheet.absoluteFillObject,
    top: 28,
    backgroundColor: colors.offwhite
  },
  satelliteBase: {
    backgroundColor: "#9DB593"
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#B7E4C766"
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#B7E4C766"
  },
  contour: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#40916C44",
    borderRadius: 100,
    transform: [{ rotate: "-15deg" }]
  },
  contourOne: {
    width: 330,
    height: 115,
    top: 90,
    left: -35
  },
  contourTwo: {
    width: 420,
    height: 135,
    top: 180,
    left: 20
  },
  contourThree: {
    width: 360,
    height: 110,
    bottom: 205,
    left: -25
  },
  polygon: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.leaf,
    borderStyle: "dashed",
    backgroundColor: "#40916C22",
    alignItems: "center",
    justifyContent: "center"
  },
  polygonA: {
    width: 170,
    height: 145,
    left: "20%",
    top: "16%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 48,
    borderBottomLeftRadius: 26,
    transform: [{ rotate: "8deg" }]
  },
  polygonB: {
    width: 145,
    height: 105,
    right: "6%",
    top: "14%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 42,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 34,
    borderColor: colors.canopy,
    transform: [{ rotate: "-10deg" }]
  },
  polygonText: {
    color: colors.canopy,
    fontSize: 11,
    fontWeight: "900"
  },
  pinWrap: {
    position: "absolute",
    marginLeft: -12,
    marginTop: -24
  },
  pin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
    borderWidth: 2,
    borderColor: colors.white,
    transform: [{ rotate: "-45deg" }],
    shadowColor: colors.dark,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  currentLocation: {
    position: "absolute",
    left: "50%",
    top: "55%",
    width: 38,
    height: 38,
    marginLeft: -19,
    marginTop: -19,
    alignItems: "center",
    justifyContent: "center"
  },
  currentPulse: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(33,150,243,0.18)"
  },
  currentDot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: "#2196F3"
  },
  topBar: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.dark,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4
  },
  searchIcon: {
    color: colors.gray,
    fontSize: 14
  },
  searchInput: {
    flex: 1,
    color: colors.dark,
    fontSize: 13,
    paddingVertical: 0
  },
  squareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4
  },
  squareButtonText: {
    fontSize: 18
  },
  layerToggle: {
    position: "absolute",
    top: 102,
    right: 14,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4
  },
  layerButton: {
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  layerActive: {
    backgroundColor: colors.canopy
  },
  layerText: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  layerTextActive: {
    color: colors.white
  },
  compass: {
    position: "absolute",
    top: 178,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4
  },
  compassText: {
    color: colors.forest,
    fontSize: 19,
    fontWeight: "900"
  },
  infoCard: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 96,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: colors.dark,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12
  },
  infoTitle: {
    flex: 1,
    color: colors.dark,
    fontSize: 12,
    fontWeight: "900"
  },
  activeText: {
    color: colors.leaf,
    fontSize: 10,
    fontWeight: "900"
  },
  infoMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  infoMeta: {
    color: colors.gray,
    fontSize: 11
  },
  cta: {
    marginTop: 11,
    borderRadius: 10,
    paddingVertical: 11,
    backgroundColor: colors.leaf,
    alignItems: "center"
  },
  ctaText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.78
  }
});
