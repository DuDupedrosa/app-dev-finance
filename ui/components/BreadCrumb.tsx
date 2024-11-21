import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { customTheme } from "@/theme/theme";
import { router } from "expo-router";

export default function BreadCrumb({ route }: { route: string }) {
  return (
    <View style={styles.container}>
      {/* home */}
      <TouchableOpacity
        style={styles.itemFlex}
        onPress={() => router.push("/(tabs)")}
      >
        <FontAwesome5
          color={customTheme.colors["gray-900"]}
          name="house-user"
          size={18}
        />
        <Text style={[styles.label, { marginLeft: 4 }]} variant="labelMedium">
          Dashboard
        </Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={18}
          color={customTheme.colors["custom-gray-1"]}
        />
      </TouchableOpacity>
      <View style={[styles.itemFlex]}>
        <Text
          style={[
            styles.label,
            { textDecorationLine: "underline", fontWeight: "bold" },
          ]}
          variant="labelMedium"
        >
          {route}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemFlex: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  label: {
    color: customTheme.colors["gray-900"],
  },
});
