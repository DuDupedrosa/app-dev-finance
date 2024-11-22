import { customTheme } from "@/theme/theme";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { storeUserData } from "@/helpers/methods/asyncStorage";

export default function Logout() {
  useEffect(() => {
    storeUserData("", "");
    router.push("/auth");
  }, []);
  return <SafeAreaView></SafeAreaView>;
}
