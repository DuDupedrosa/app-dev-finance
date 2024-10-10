import { customTheme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function AuthPageTitle({ title }: { title: string }) {
  return (
    <Text variant="headlineLarge" style={styles.title}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: customTheme.colors.black,
    fontWeight: "600",
  },
});
