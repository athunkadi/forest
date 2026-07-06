import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { RootStackParamList } from "../types";

type Props = {
  active: keyof RootStackParamList;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

const tabs = [
  { route: screens.home, icon: "⌂", label: "Beranda" },
  { route: screens.map, icon: "◎", label: "Peta" },
  { route: screens.capture, icon: "＋", label: "" },
  { route: screens.history, icon: "≡", label: "Riwayat" },
  { route: screens.sync, icon: "↻", label: "Sinkron" }
] as const;

export function BottomNav({ active }: Props) {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        if (tab.route === screens.capture) {
          return (
            <Pressable
              key={tab.route}
              accessibilityRole="button"
              accessibilityLabel="Buka kamera"
              style={({ pressed }) => [styles.capture, pressed && styles.pressed]}
              onPress={() => navigation.navigate(screens.capture)}
            >
              <Text style={styles.captureIcon}>{tab.icon}</Text>
            </Pressable>
          );
        }

        const isActive = active === tab.route;
        return (
          <Pressable
            key={tab.route}
            accessibilityRole="button"
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Text style={[styles.icon, isActive && styles.activeText]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeText]}>{tab.label}</Text>
            <View style={[styles.indicator, isActive && styles.activeIndicator]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightgray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 2
  },
  icon: {
    color: colors.gray,
    fontSize: 21,
    lineHeight: 23
  },
  label: {
    color: colors.gray,
    fontSize: 10,
    fontWeight: "600"
  },
  activeText: {
    color: colors.canopy,
    fontWeight: "800"
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent"
  },
  activeIndicator: {
    backgroundColor: colors.canopy
  },
  capture: {
    width: 58,
    height: 58,
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 29,
    backgroundColor: colors.leaf,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.leaf,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8
  },
  captureIcon: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72
  }
});
