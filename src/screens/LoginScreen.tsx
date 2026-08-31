import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { saveAuthUser } from "../storage/localStorage";
import { useAppStore } from "../store/useAppStore";
import { AuthUser, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.login>;

const googleDemoUser: AuthUser = {
  id: "google-demo-ahmad",
  name: "Ahmad Fauzi",
  email: "ahmad.fauzi@gmail.com",
  initials: "AF",
  provider: "google"
};

export function LoginScreen({ navigation }: Props) {
  const { setAuthUser } = useAppStore();
  const [loadingMethod, setLoadingMethod] = useState<"credentials" | "google" | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loading = loadingMethod !== null;

  async function handleGoogleLogin() {
    if (loading) {
      return;
    }

    setError("");
    setLoadingMethod("google");
    await saveAuthUser(googleDemoUser);
    setAuthUser(googleDemoUser);
    navigation.replace(screens.home);
  }

  async function handleCredentialLogin() {
    if (loading) {
      return;
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setError("");
    setLoadingMethod("credentials");

    const normalizedName = trimmedUsername
      .split(/[._\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const initials = normalizedName
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const credentialUser: AuthUser = {
      id: `credentials-${trimmedUsername.toLowerCase()}`,
      name: normalizedName || trimmedUsername,
      email: trimmedUsername.includes("@") ? trimmedUsername : `${trimmedUsername}@foresttrack.local`,
      initials: initials || "PL",
      provider: "credentials"
    };

    await saveAuthUser(credentialUser);
    setAuthUser(credentialUser);
    navigation.replace(screens.home);
  }

  return (
    <LinearGradient colors={[colors.offwhite, colors.mist]} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brand}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>FT</Text>
              </View>
              <Text style={styles.appName}>ForestTrack</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.kicker}>Login petugas</Text>
              <Text style={styles.title}>Masuk ke akun lapangan</Text>
              <Text style={styles.subtitle}>
                Gunakan username dan password tim, atau masuk cepat dengan akun Google.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    placeholder="contoh: ahmad.fauzi"
                    placeholderTextColor={colors.gray}
                    returnKeyType="next"
                    style={styles.input}
                    value={username}
                    onChangeText={(value) => {
                      setUsername(value);
                      setError("");
                    }}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    editable={!loading}
                    placeholder="Masukkan password"
                    placeholderTextColor={colors.gray}
                    returnKeyType="done"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setError("");
                    }}
                    onSubmitEditing={handleCredentialLogin}
                  />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Login dengan username dan password"
                  disabled={loading}
                  style={({ pressed }) => [styles.loginButton, pressed && styles.pressed, loading && styles.disabled]}
                  onPress={handleCredentialLogin}
                >
                  {loadingMethod === "credentials" ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.loginText}>Login</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>atau</Text>
                <View style={styles.divider} />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Masuk dengan akun Google"
                disabled={loading}
                style={({ pressed }) => [styles.googleButton, pressed && styles.pressed, loading && styles.disabled]}
                onPress={handleGoogleLogin}
              >
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleText}>Masuk dengan Google</Text>
                {loadingMethod === "google" ? (
                  <ActivityIndicator color={colors.forest} size="small" />
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </Pressable>
            </View>

            <Text style={styles.privacy}>Data login disimpan lokal untuk simulasi akses petugas.</Text>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  keyboard: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    justifyContent: "space-between"
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center"
  },
  logoText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  appName: {
    color: colors.forest,
    fontSize: 18,
    fontWeight: "900"
  },
  content: {
    gap: 14
  },
  kicker: {
    color: colors.canopy,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  title: {
    color: colors.dark,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 12
  },
  form: {
    gap: 12
  },
  inputGroup: {
    gap: 7
  },
  label: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "800"
  },
  input: {
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgray,
    color: colors.dark,
    fontSize: 15,
    fontWeight: "700"
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700"
  },
  loginButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.forest,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4
  },
  loginText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightgray
  },
  dividerText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800"
  },
  googleButton: {
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgray,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  googleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.offwhite,
    alignItems: "center",
    justifyContent: "center"
  },
  googleIconText: {
    color: "#4285F4",
    fontSize: 18,
    fontWeight: "900"
  },
  googleText: {
    flex: 1,
    color: colors.dark,
    fontSize: 16,
    fontWeight: "800"
  },
  chevron: {
    color: colors.forest,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "500"
  },
  privacy: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },
  pressed: {
    opacity: 0.78
  },
  disabled: {
    opacity: 0.72
  }
});
