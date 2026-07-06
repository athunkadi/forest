import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { SyncStatus } from "../types";

type Props = {
  status: SyncStatus;
  compact?: boolean;
};

export function SyncBadge({ status, compact = false }: Props) {
  const label = status === "synced" ? "Terkirim" : status === "failed" ? "Gagal" : "Pending";
  const icon = status === "synced" ? "✓" : status === "failed" ? "!" : "⏳";
  const palette = {
    synced: { bg: colors.mist, text: colors.canopy },
    pending: { bg: "#F4A26122", text: colors.accent },
    failed: { bg: "#E6394622", text: colors.danger }
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, compact && styles.compact]}>
      <Text style={[styles.text, { color: palette.text }]}>{compact ? icon : `${icon} ${label}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  compact: {
    minWidth: 26,
    alignItems: "center"
  },
  text: {
    fontSize: 9,
    fontWeight: "800"
  }
});
