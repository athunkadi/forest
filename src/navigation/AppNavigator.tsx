import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { CaptureFormScreen } from "../screens/CaptureFormScreen";
import { CaptureScreen } from "../screens/CaptureScreen";
import { CaptureSuccessScreen } from "../screens/CaptureSuccessScreen";
import { HistoryDetailScreen } from "../screens/HistoryDetailScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MapScreen } from "../screens/MapScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SyncScreen } from "../screens/SyncScreen";
import { TrackingScreen } from "../screens/TrackingScreen";
import { getAuthUser, getOnboarded } from "../storage/localStorage";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    let mounted = true;

    async function prepareInitialRoute() {
      const [onboarded, authUser] = await Promise.all([getOnboarded(), getAuthUser()]);

      if (!mounted) {
        return;
      }

      if (!onboarded) {
        setInitialRoute(screens.onboarding);
        return;
      }

      setInitialRoute(authUser ? screens.home : screens.login);
    }

    prepareInitialRoute();

    return () => {
      mounted = false;
    };
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.canopy} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.offwhite }
        }}
      >
        <Stack.Screen name={screens.onboarding} component={OnboardingScreen} />
        <Stack.Screen name={screens.login} component={LoginScreen} />
        <Stack.Screen name={screens.home} component={HomeScreen} />
        <Stack.Screen name={screens.profile} component={ProfileScreen} />
        <Stack.Screen name={screens.map} component={MapScreen} />
        <Stack.Screen name={screens.capture} component={CaptureScreen} />
        <Stack.Screen name={screens.captureForm} component={CaptureFormScreen} />
        <Stack.Screen name={screens.captureSuccess} component={CaptureSuccessScreen} />
        <Stack.Screen name={screens.history} component={HistoryScreen} />
        <Stack.Screen name={screens.historyDetail} component={HistoryDetailScreen} />
        <Stack.Screen name={screens.sync} component={SyncScreen} />
        <Stack.Screen name={screens.tracking} component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.offwhite
  }
});
