import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  label: string;
  value: string;
  tone: string;
};

export function StatCard({ label, value, tone }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: tone }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 78,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  value: {
    fontSize: 23,
    fontWeight: "900"
  },
  label: {
    marginTop: 3,
    color: colors.gray,
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center",
    fontWeight: "600"
  }
});
