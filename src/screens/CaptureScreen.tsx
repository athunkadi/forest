import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { getLastKnownLocation, saveLastKnownLocation } from "../storage/localStorage";
import { useAppStore } from "../store/useAppStore";
import { GpsPoint, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.capture>;
const photoDirectory = `${FileSystem.documentDirectory ?? ""}capture-photos/`;

async function persistPhoto(uri?: string, timestamp?: string) {
  if (!uri || !FileSystem.documentDirectory) {
    return uri;
  }

  const directory = await FileSystem.getInfoAsync(photoDirectory);
  if (!directory.exists) {
    await FileSystem.makeDirectoryAsync(photoDirectory, { intermediates: true });
  }

  const filename = `${(timestamp ?? new Date().toISOString()).replace(/[:.]/g, "-")}.jpg`;
  const destination = `${photoDirectory}${filename}`;
  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

export function CaptureScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView | null>(null);
  const { gps } = useAppStore();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [captureGps, setCaptureGps] = useState<GpsPoint>(gps);
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const [capturedAt, setCapturedAt] = useState(new Date().toISOString());

  useEffect(() => {
    let mounted = true;

    async function detectLocation() {
      const savedLocation = await getLastKnownLocation();
      if (savedLocation && mounted) {
        setCaptureGps((current) => ({
          ...current,
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          accuracy: savedLocation.accuracy ? Math.round(savedLocation.accuracy) : current.accuracy,
          altitude: savedLocation.altitude ? Math.round(savedLocation.altitude) : current.altitude
        }));
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        mayShowUserSettingsDialog: true
      });

      if (!mounted) {
        return;
      }

      const nextGps: GpsPoint = {
        ...gps,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        accuracy: current.coords.accuracy ? Math.round(current.coords.accuracy) : gps.accuracy,
        altitude: current.coords.altitude ? Math.round(current.coords.altitude) : gps.altitude
      };
      setCaptureGps(nextGps);
      await saveLastKnownLocation({
        latitude: nextGps.latitude,
        longitude: nextGps.longitude,
        accuracy: nextGps.accuracy,
        altitude: nextGps.altitude,
        updatedAt: new Date().toISOString()
      });
    }

    detectLocation();

    return () => {
      mounted = false;
    };
  }, [gps]);

  async function handleCapture() {
    if (capturing) {
      return;
    }

    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        navigation.navigate(screens.captureForm, {
          capturedAt,
          gps: captureGps
        });
        return;
      }

      return;
    }

    if (!cameraReady) {
      return;
    }

    setCapturing(true);
    const timestamp = new Date().toISOString();
    setCapturedAt(timestamp);

    try {
      const photo = cameraReady
        ? await cameraRef.current?.takePictureAsync({
            quality: 0.82,
            skipProcessing: false
          })
        : undefined;
      const photoUri = await persistPhoto(photo?.uri, timestamp);

      navigation.navigate(screens.captureForm, {
        photoUri,
        capturedAt: timestamp,
        gps: captureGps
      });
    } finally {
      setCapturing(false);
    }
  }

  const capturedDate = new Date(capturedAt);
  const formattedDate = capturedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const formattedTime = capturedDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const showCamera = cameraPermission?.granted;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.viewfinder}>
        {showCamera ? (
          <CameraView
            ref={cameraRef}
            animateShutter
            facing="back"
            flash={flash ? "on" : "off"}
            style={styles.camera}
            onCameraReady={() => setCameraReady(true)}
          />
        ) : (
          <View style={styles.forestHint}>
            <View style={styles.treeA} />
            <View style={styles.treeB} />
            <View style={styles.treeC} />
            <Pressable style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]} onPress={requestCameraPermission}>
              <Text style={styles.permissionText}>Aktifkan Kamera</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.topOverlay}>
          <Text style={styles.overlayText}>📡 ±{captureGps.accuracy}m</Text>
          <Text style={styles.overlayMono}>
            {captureGps.latitude.toFixed(4)}° | {captureGps.longitude.toFixed(4)}°
          </Text>
          <Text style={styles.overlayText}>Alt: {captureGps.altitude}m</Text>
        </View>

        <View style={styles.crosshair}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.overlayText}>📅 {formattedDate}</Text>
          <Text style={styles.overlayText}>🕙 {formattedTime} WIB</Text>
          <Text style={[styles.overlayText, styles.blockText]}>{captureGps.block}</Text>
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
          onPress={handleCapture}
        >
          {capturing ? <ActivityIndicator color={colors.forest} /> : <View style={styles.shutterInner} />}
        </Pressable>

        <Pressable style={({ pressed }) => [styles.controlButton, flash && styles.controlActive, pressed && styles.pressed]} onPress={() => setFlash((value) => !value)}>
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
  camera: {
    ...StyleSheet.absoluteFillObject
  },
  forestHint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#172019",
    alignItems: "center",
    justifyContent: "center"
  },
  permissionButton: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.gold
  },
  permissionText: {
    color: colors.soil,
    fontSize: 13,
    fontWeight: "900"
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
  controlActive: {
    backgroundColor: "rgba(233,196,106,0.28)"
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
