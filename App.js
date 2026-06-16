import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./01-autenticacao/LoginScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LoginScreen />
    </SafeAreaProvider>
  );
}
