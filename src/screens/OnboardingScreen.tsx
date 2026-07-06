import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { setOnboarded } from "../storage/localStorage";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, typeof screens.onboarding>;

const steps = [
  {
    icon: "🌳",
    title: "Selamat Datang di\nForestTrack",
    subtitle: "Aplikasi pencatatan lapangan untuk kehutanan dan konservasi. Bekerja tanpa sinyal internet sekalipun.",
    cta: "Mulai"
  },
  {
    icon: "📍",
    title: "Catat Lokasi\nDimana Saja",
    subtitle: "GPS akurat hingga 5 meter. Tandai titik, tambah foto dan catatan bahkan di dalam hutan lebat.",
    cta: "Selanjutnya"
  },
  {
    icon: "🗺️",
    title: "Peta Offline\nSelalu Siap",
    subtitle: "Unduh peta topografi kawasan sebelum ke lapangan. Lihat polygon hutan dan titik yang sudah dicatat.",
    cta: "Selanjutnya"
  },
  {
    icon: "☁️",
    title: "Sinkron Otomatis\nSaat Ada Sinyal",
    subtitle: "Data tersimpan aman di perangkat. Begitu ada koneksi internet, semua data terkirim otomatis.",
    cta: "Ayo Mulai →"
  }
];

export function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const current = steps[step];

  async function handleNext() {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    await setOnboarded(true);
    navigation.replace(screens.home);
  }

  return (
    <LinearGradient colors={[colors.forest, colors.canopy, colors.leaf]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.progressRow}>
          {steps.map((_, index) => (
            <View key={index} style={[styles.progressDot, index === step && styles.progressActive]} />
          ))}
        </View>

        <View style={styles.center}>
          <Text style={styles.icon}>{current.icon}</Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handleNext}>
          <Text style={styles.buttonText}>{current.cta}</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  safe: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 26,
    paddingBottom: 34,
    justifyContent: "space-between"
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7
  },
  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.35)"
  },
  progressActive: {
    width: 25,
    backgroundColor: colors.gold
  },
  center: {
    alignItems: "center"
  },
  icon: {
    fontSize: 80,
    marginBottom: 24
  },
  title: {
    color: colors.white,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16
  },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center"
  },
  button: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: colors.gold,
    alignItems: "center"
  },
  buttonText: {
    color: colors.soil,
    fontSize: 16,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.82
  }
});
