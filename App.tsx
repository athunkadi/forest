import { AppProvider } from "./src/app/AppProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
