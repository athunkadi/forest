import { StatusBar, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  online: boolean;
  dark?: boolean;
};

export function StatusBarCustom({ online, dark = false }: Props) {
  return (
    <>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={dark ? colors.forest : colors.white} />
      <View style={[styles.container, dark && styles.darkContainer]}>
        <Text style={[styles.time, dark && styles.darkText]}>9:41</Text>
        <View style={styles.right}>
          <View style={[styles.dot, { backgroundColor: online ? colors.leaf : colors.danger }]} />
          <Text style={[styles.status, { color: online ? colors.leaf : colors.danger }]}>
            {online ? "ONLINE" : "OFFLINE"}
          </Text>
          <Text style={[styles.signal, dark && styles.darkText]}>●●●</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 28,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  darkContainer: {
    backgroundColor: colors.forest
  },
  time: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700"
  },
  darkText: {
    color: colors.white
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  status: {
    fontSize: 10,
    fontWeight: "800"
  },
  signal: {
    color: colors.gray,
    fontSize: 10
  }
});
