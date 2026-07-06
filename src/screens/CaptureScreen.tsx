import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.capture>;

export function CaptureScreen({ navigation }: Props) {
  const { gps } = useAppStore();

  return (
    <SafeAreaView style={styles.screen}>
      {/* TODO: Replace this mocked viewfinder with expo-camera preview and captured photo URI. */}
      <View style={styles.viewfinder}>
        <View style={styles.forestHint}>
          <View style={styles.treeA} />
          <View style={styles.treeB} />
          <View style={styles.treeC} />
        </View>

        <View style={styles.topOverlay}>
          <Text style={styles.overlayText}>📡 ±{gps.accuracy}m</Text>
          <Text style={styles.overlayMono}>
            {gps.latitude.toFixed(4)}° | {gps.longitude.toFixed(4)}°
          </Text>
          <Text style={styles.overlayText}>Alt: {gps.altitude}m</Text>
        </View>

        <View style={styles.crosshair}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.overlayText}>📅 01 Mei 2026</Text>
          <Text style={styles.overlayText}>🕙 10:44 WIB</Text>
          <Text style={[styles.overlayText, styles.blockText]}>{gps.block}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]} onPress={() => navigation.navigate(screens.home)}>
          <Text style={styles.controlText}>✕</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ambil foto"
          style={({ pressed }) => [styles.shutterOuter, pressed && styles.pressed]}
          onPress={() => navigation.navigate(screens.captureForm)}
        >
          <View style={styles.shutterInner} />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}>
          <Text style={styles.controlText}>⚡</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1a1a1a"
  },
  viewfinder: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-between",
    overflow: "hidden"
  },
  forestHint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#172019"
  },
  treeA: {
    position: "absolute",
    left: "10%",
    bottom: 0,
    width: 96,
    height: "72%",
    backgroundColor: "#244C34",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    opacity: 0.62
  },
  treeB: {
    position: "absolute",
    right: "8%",
    bottom: 0,
    width: 118,
    height: "82%",
    backgroundColor: "#1B4332",
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    opacity: 0.7
  },
  treeC: {
    position: "absolute",
    left: "38%",
    bottom: -40,
    width: 150,
    height: "62%",
    backgroundColor: "#2D6A4F",
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    opacity: 0.36
  },
  topOverlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  bottomOverlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  overlayText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700"
  },
  overlayMono: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "800"
  },
  blockText: {
    color: colors.mist
  },
  crosshair: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 88,
    height: 88,
    marginLeft: -44,
    marginTop: -44,
    borderWidth: 1,
    borderColor: "#E9C46A88",
    borderRadius: 8
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: colors.gold
  },
  topLeft: {
    left: -2,
    top: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3
  },
  topRight: {
    right: -2,
    top: -2,
    borderTopWidth: 3,
    borderRightWidth: 3
  },
  bottomLeft: {
    left: -2,
    bottom: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3
  },
  bottomRight: {
    right: -2,
    bottom: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3
  },
  controls: {
    minHeight: 128,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 28,
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  controlText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800"
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#EFEFEF"
  },
  pressed: {
    opacity: 0.72
  }
});
