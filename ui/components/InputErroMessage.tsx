import { customTheme } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Foundation from "@expo/vector-icons/Foundation";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";

export default function InputErroMessage({ label }: { label?: string }) {
  return (
    <Animated.View
      entering={FadeInLeft.duration(300).easing(Easing.inOut(Easing.ease))}
      style={styles.content}
    >
      <Foundation
        name="alert"
        size={18}
        color={customTheme.colors["red-600"]}
      />
      <Text variant="labelSmall" style={styles.label}>
        {label ? label : "Campo obrigatório"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  label: {
    color: customTheme.colors["red-600"],
    fontWeight: "500",
  },
});
