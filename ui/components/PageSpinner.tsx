import { customTheme } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function PageSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size={"large"}
        color={customTheme.colors["primary-600"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
