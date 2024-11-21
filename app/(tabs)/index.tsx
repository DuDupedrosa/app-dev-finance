import { customTheme } from "@/theme/theme";
import HomeComponent from "@/ui/tabs/home/HomeComponents";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <HomeComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
