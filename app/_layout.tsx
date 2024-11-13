import { theme } from "@/theme/theme";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { BaseToast } from "react-native-toast-message";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50", // Borda verde
        backgroundColor: "#E6F4EA", // Fundo verde suave
      }}
      text1Style={{
        color: "#4CAF50", // Texto verde escuro
        fontWeight: "bold",
      }}
      text2Style={{
        color: "#333",
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#F44336", // Borda vermelha
        backgroundColor: "#FDECEA", // Fundo vermelho claro
      }}
      text1Style={{
        color: "#F44336", // Texto vermelho escuro
        fontWeight: "bold",
      }}
      text2Style={{
        color: "#333",
      }}
    />
  ),
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Slot />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
