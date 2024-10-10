import { StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AuthBackPageIcon({ onBack }: { onBack: () => void }) {
  return (
    <TouchableOpacity onPress={() => onBack()}>
      <View style={styles.backIconContainer}>
        <AntDesign name="back" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backIconContainer: {
    marginBottom: 24,
    cursor: "pointer",
    padding: 4,
    maxWidth: 38,
  },
});
