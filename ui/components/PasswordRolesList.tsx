import { customTheme } from "@/theme/theme";
import { StyleSheet, View, Text } from "react-native";

const roles = [
  "6 caracteres",
  "1 caractere especial",
  "1 número",
  "1 caractere minusculo",
  "1 caractere maiúsculo",
];

export default function PasswordRolesList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>A senha precisa conter no mínimo:</Text>
      <View style={styles.listContainer}>
        {roles.map((role, i) => {
          return (
            <View key={i} style={styles.listItemContainer}>
              <View style={styles.listItemCircle} />
              <Text style={styles.listItemText}>{role}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "medium",
    color: customTheme.colors.black,
    marginBottom: 8,
  },
  listContainer: {
    gap: 8,
    flexDirection: "column",
  },
  listItemText: {
    fontSize: 12,
    color: customTheme.colors.black,
    fontWeight: "normal",
  },
  listItemCircle: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: customTheme.colors.black,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
