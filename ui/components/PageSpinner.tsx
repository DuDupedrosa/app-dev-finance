import { customTheme } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function PageSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size={"large"}
        color={customTheme.colors["primary-600"]}
      />
      <Text style={styles.label} variant="labelMedium">
        Buscando informações
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    textAlign: "center",
    marginTop: 8,
  },
});
