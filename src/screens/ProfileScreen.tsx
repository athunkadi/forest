import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBarCustom } from "../components/StatusBarCustom";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { removeAuthUser } from "../storage/localStorage";
import { useAppStore } from "../store/useAppStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.profile>;

export function ProfileScreen({ navigation }: Props) {
  const { authUser, online, setAuthUser } = useAppStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const name = authUser?.name ?? "Petugas Lapangan";
  const email = authUser?.email ?? "Belum ada email";
  const initials = authUser?.initials ?? "PL";
  const providerLabel = authUser?.provider === "google" ? "Google Account" : "Username & Password";

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    await removeAuthUser();
    setAuthUser(null);
    navigation.replace(screens.login);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarCustom online={online} dark />

      <LinearGradient colors={[colors.forest, colors.canopy]} style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke beranda"
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Provider login</Text>
            <Text style={styles.infoValue}>{providerLabel}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status sinkronisasi</Text>
            <Text style={styles.infoValue}>{online ? "Online" : "Offline"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Akses</Text>
            <Text style={styles.infoValue}>Petugas lapangan</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keluar dari akun"
          disabled={loggingOut}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed, loggingOut && styles.disabled]}
          onPress={handleLogout}
        >
          {loggingOut ? <ActivityIndicator color={colors.white} /> : <Text style={styles.logoutText}>Logout</Text>}
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center"
  },
  backText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "700"
  },
  identity: {
    alignItems: "center",
    paddingTop: 12
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.moss,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14
  },
  avatarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900"
  },
  name: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900"
  },
  email: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    marginTop: 4
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: colors.dark,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2
  },
  infoRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  infoLabel: {
    flex: 1,
    color: colors.gray,
    fontSize: 13,
    fontWeight: "700"
  },
  infoValue: {
    flex: 1,
    color: colors.dark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right"
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgray
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center"
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.76
  },
  disabled: {
    opacity: 0.7
  }
});
