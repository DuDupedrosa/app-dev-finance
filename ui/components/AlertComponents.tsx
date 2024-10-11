import { customTheme } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Foundation from "@expo/vector-icons/Foundation";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";

export default function AlertComponent({
  type,
  text,
  onClose,
}: {
  type: "success" | "erro";
  text: string;
  onClose?: () => void;
}) {
  function getAlertStylesByType() {
    const literal = {
      ["success"]: {
        bg: customTheme.colors["primary-500"],
      },
      ["erro"]: {
        bg: customTheme.colors["red-600"],
      },
    };

    return literal[type];
  }

  function getAlertIconByType() {
    if (type === "erro") {
      return (
        <Foundation name="alert" size={20} color={customTheme.colors.light} />
      );
    }

    return (
      <AntDesign
        name="checkcircleo"
        size={20}
        color={customTheme.colors.light}
      />
    );
  }

  return (
    <Animated.View
      entering={FadeInLeft.duration(300).easing(Easing.inOut(Easing.ease))}
      style={{
        ...styles.container,
        backgroundColor: getAlertStylesByType().bg,
      }}
    >
      <View style={styles.content}>
        {getAlertIconByType()}
        <Text variant="labelMedium" style={styles.text}>
          {text}
        </Text>
      </View>
      {onClose && (
        <View style={styles.iconCloseContainer}>
          <TouchableOpacity onPress={() => onClose()}>
            <AntDesign
              name="closecircleo"
              size={20}
              color={customTheme.colors.light}
            />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    position: "relative",
  },
  content: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  text: {
    color: customTheme.colors.light,
    fontWeight: "500",
    paddingRight: 8,
  },
  iconCloseContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 2,
  },
});
