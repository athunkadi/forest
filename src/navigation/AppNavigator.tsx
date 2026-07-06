import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../constants/colors";
import { screens } from "../constants/screens";
import { CaptureFormScreen } from "../screens/CaptureFormScreen";
import { CaptureScreen } from "../screens/CaptureScreen";
import { CaptureSuccessScreen } from "../screens/CaptureSuccessScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MapScreen } from "../screens/MapScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { SyncScreen } from "../screens/SyncScreen";
import { TrackingScreen } from "../screens/TrackingScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={screens.onboarding}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.offwhite }
        }}
      >
        <Stack.Screen name={screens.onboarding} component={OnboardingScreen} />
        <Stack.Screen name={screens.home} component={HomeScreen} />
        <Stack.Screen name={screens.map} component={MapScreen} />
        <Stack.Screen name={screens.capture} component={CaptureScreen} />
        <Stack.Screen name={screens.captureForm} component={CaptureFormScreen} />
        <Stack.Screen name={screens.captureSuccess} component={CaptureSuccessScreen} />
        <Stack.Screen name={screens.history} component={HistoryScreen} />
        <Stack.Screen name={screens.sync} component={SyncScreen} />
        <Stack.Screen name={screens.tracking} component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
