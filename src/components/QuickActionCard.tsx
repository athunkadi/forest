import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
};

export function QuickActionCard({ icon, label, subtitle, color, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, { borderLeftColor: color }, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    minHeight: 96,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 13,
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  icon: {
    fontSize: 22,
    marginBottom: 5
  },
  label: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  }
});
