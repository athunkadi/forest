import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system/legacy";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Callout, Circle, LocalTile, Marker, Polygon, Region } from "react-native-maps";
import { BottomNav } from "../components/BottomNav";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { getLastKnownLocation, saveLastKnownLocation } from "../storage/localStorage";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList, StoredLocation } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.map>;
type Layer = "topo" | "satelit";

const DEFAULT_DELTA = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012
};

const offlineTileRoot = `${(FileSystem.documentDirectory ?? "").replace("file://", "")}offline-tiles`;
const offlineTileTemplate = `${offlineTileRoot}/{z}/{x}/{y}.png`;
const mapsApiKeyConfigured = true;

function toRegion(location: Pick<StoredLocation, "latitude" | "longitude">): Region {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    ...DEFAULT_DELTA
  };
}

function getLocationTimestamp() {
  return new Date().toISOString();
}

function getLocationMessage(location: StoredLocation | null, permissionDenied: boolean) {
  if (location) {
    const accuracy = location.accuracy ? `±${Math.round(location.accuracy)}m` : "GPS aktif";
    return `${accuracy} · ${new Date(location.updatedAt).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  }

  return permissionDenied ? "Izin lokasi belum aktif" : "Mencari lokasi device...";
}

export function MapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [layer, setLayer] = useState<Layer>("topo");
  const [deviceLocation, setDeviceLocation] = useState<StoredLocation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [offlineTilesReady, setOfflineTilesReady] = useState(false);
  const { gps, notes, online } = useAppStore();

  const fallbackRegion = useMemo(() => toRegion(gps), [gps]);
  const mapRegion = useMemo(() => (deviceLocation ? toRegion(deviceLocation) : fallbackRegion), [deviceLocation, fallbackRegion]);
  const blockPolygon = useMemo(
    () => [
      { latitude: gps.latitude + 0.0023, longitude: gps.longitude - 0.0031 },
      { latitude: gps.latitude + 0.0028, longitude: gps.longitude + 0.0024 },
      { latitude: gps.latitude - 0.0011, longitude: gps.longitude + 0.003 },
      { latitude: gps.latitude - 0.0027, longitude: gps.longitude - 0.0017 }
    ],
    [gps]
  );
  const mapType = layer === "satelit" ? "satellite" : Platform.OS === "android" && offlineTilesReady ? "none" : "terrain";
  const locationMessage = getLocationMessage(deviceLocation, permissionDenied);

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;

    async function prepareMap() {
      try {
        const [savedLocation, tileDirectory] = await Promise.all([
          getLastKnownLocation(),
          FileSystem.getInfoAsync(offlineTileRoot)
        ]);

        if (!mounted) {
          return;
        }

        if (savedLocation) {
          setDeviceLocation(savedLocation);
        }
        setOfflineTilesReady(tileDirectory.exists);

        const permission = await Location.requestForegroundPermissionsAsync();
        if (!mounted) {
          return;
        }

        if (permission.status !== "granted") {
          setPermissionDenied(true);
          setLoadingLocation(false);
          return;
        }

        setPermissionDenied(false);

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          mayShowUserSettingsDialog: true
        });
        const currentLocation: StoredLocation = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          accuracy: current.coords.accuracy,
          altitude: current.coords.altitude,
          updatedAt: getLocationTimestamp()
        };

        if (!mounted) {
          return;
        }

        setDeviceLocation(currentLocation);
        setLoadingLocation(false);
        mapRef.current?.animateToRegion(toRegion(currentLocation), 600);
        await saveLastKnownLocation(currentLocation);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 5,
            timeInterval: 5000
          },
          (position) => {
            const nextLocation: StoredLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              updatedAt: getLocationTimestamp()
            };
            setDeviceLocation(nextLocation);
            saveLastKnownLocation(nextLocation);
          }
        );
      } catch {
        if (mounted) {
          setLoadingLocation(false);
        }
      }
    }

    prepareMap();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  function recenterMap() {
    mapRef.current?.animateToRegion(mapRegion, 600);
  }

  if (!mapsApiKeyConfigured) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBarCustom online={online} />
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>Peta belum dikonfigurasi</Text>
          <Text style={styles.configText}>
            APK Android membutuhkan Google Maps API key. Set environment `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
            saat build, lalu rebuild APK.
          </Text>
        </View>
        <BottomNav active={screens.map} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        mapPadding={{ top: 110, right: 18, bottom: 210, left: 18 }}
        mapType={mapType}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale
        showsUserLocation={!permissionDenied}
        toolbarEnabled={false}
        userLocationAnnotationTitle="Lokasi Anda"
      >
        {layer === "topo" && offlineTilesReady ? (
          <LocalTile pathTemplate={offlineTileTemplate} tileSize={256} zIndex={1} />
        ) : null}

        <Polygon
          coordinates={blockPolygon}
          fillColor="rgba(64,145,108,0.18)"
          strokeColor={colors.canopy}
          strokeWidth={2}
          tappable
        />

        {deviceLocation?.accuracy ? (
          <Circle
            center={deviceLocation}
            fillColor="rgba(33,150,243,0.12)"
            radius={Math.max(deviceLocation.accuracy, 12)}
            strokeColor="rgba(33,150,243,0.32)"
            strokeWidth={1}
          />
        ) : null}

        {notes.map((note) => (
          <Marker
            key={note.id}
            coordinate={{ latitude: note.gps.latitude, longitude: note.gps.longitude }}
            pinColor={note.syncStatus === "synced" ? colors.leaf : colors.accent}
            title={note.id}
            description={`${note.category} · ${note.gps.block}`}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{note.id}</Text>
                <Text style={styles.calloutText}>{note.category}</Text>
                <Text style={styles.calloutMeta}>{note.gps.block}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {loadingLocation ? (
        <View style={styles.loadingBadge}>
          <ActivityIndicator color={colors.canopy} size="small" />
          <Text style={styles.loadingText}>Mencari GPS</Text>
        </View>
      ) : null}

      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            placeholder="Cari blok atau titik..."
            placeholderTextColor={colors.gray}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pusatkan ke lokasi device"
          style={({ pressed }) => [styles.squareButton, pressed && styles.pressed]}
          onPress={recenterMap}
        >
          <Text style={styles.squareButtonText}>◎</Text>
        </Pressable>
      </View>

      <View style={styles.layerToggle}>
        {(["topo", "satelit"] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
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
          <Text style={styles.infoTitle}>{gps.area} {gps.block}</Text>
          <Text style={[styles.activeText, permissionDenied && styles.warningText]}>
            {permissionDenied ? "● Izin lokasi" : "● GPS aktif"}
          </Text>
        </View>
        <View style={styles.infoMetaRow}>
          <Text style={styles.infoMeta}>📍 {notes.length} titik tersimpan</Text>
          <Text style={styles.infoMeta}>📡 {locationMessage}</Text>
          <Text style={styles.infoMeta}>🌿 Offline tile {offlineTilesReady ? "siap" : "belum ada"}</Text>
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
  configCard: {
    margin: 16,
    marginTop: 72,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 18,
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  configTitle: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8
  },
  configText: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 21
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: 28
  },
  loadingBadge: {
    position: "absolute",
    top: 100,
    left: 14,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.dark,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3
  },
  loadingText: {
    color: colors.canopy,
    fontSize: 12,
    fontWeight: "900"
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
    fontSize: 18,
    lineHeight: 20
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
    color: colors.forest,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "900"
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
  warningText: {
    color: colors.accent
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
  callout: {
    width: 130,
    gap: 2
  },
  calloutTitle: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "900"
  },
  calloutText: {
    color: colors.canopy,
    fontSize: 12,
    fontWeight: "800"
  },
  calloutMeta: {
    color: colors.gray,
    fontSize: 11
  },
  pressed: {
    opacity: 0.78
  }
});
