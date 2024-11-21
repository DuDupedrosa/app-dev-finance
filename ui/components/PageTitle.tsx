import { customTheme } from "@/theme/theme";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function PageTitle({ title }: { title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          display: "flex",
          backgroundColor: customTheme.colors["primary-600"],
          borderRadius: 100,
          marginTop: 12,
        }}
      ></View>
      <Text
        variant="headlineSmall"
        style={{
          color: customTheme.colors["gray-900"],
        }}
      >
        {title}
      </Text>
    </View>
  );
}
