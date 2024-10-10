import { customTheme } from "@/theme/theme";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function AuthActionButtonAndLink({
  isLogin,
}: {
  isLogin: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View>
      <TouchableOpacity style={styles.buttonSubmit}>
        <Button
          buttonColor={colors.primary}
          textColor={customTheme.colors.light}
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>
      </TouchableOpacity>

      <View style={styles.loginLinkContainer}>
        <Link href={isLogin ? "/auth/register" : "/auth"}>
          <Text variant="labelSmall" style={styles.loginLink}>
            {isLogin ? "Não tem conta?cadastro" : "Já tem conta?entrar"}
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonSubmit: {
    marginTop: 16,
  },
  loginLinkContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
  },
  loginLink: {
    backgroundColor: "blue",
    flexShrink: 1,
    padding: 12,
    color: customTheme.colors["primary-600"],
    textAlign: "center",
    textDecorationColor: customTheme.colors["primary-600"],
    textDecorationLine: "underline",
  },
});
