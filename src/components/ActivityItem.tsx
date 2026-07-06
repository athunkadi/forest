import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { Activity } from "../types";
import { SyncBadge } from "./SyncBadge";

type Props = {
  activity: Activity;
  showDivider?: boolean;
};

export function ActivityItem({ activity, showDivider = true }: Props) {
  return (
    <View style={[styles.row, showDivider && styles.divider]}>
      <Text style={styles.icon}>{activity.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.meta}>
          {activity.location} · {activity.time}
        </Text>
      </View>
      <SyncBadge status={activity.syncStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray
  },
  icon: {
    fontSize: 20
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: "700"
  },
  meta: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 2
  }
});
