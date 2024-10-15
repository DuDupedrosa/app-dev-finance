import { customTheme } from "@/theme/theme";
import { Link, router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function AuthActionButtonAndLink({
  isLogin,
  onSubmit,
  loading,
}: {
  isLogin: boolean;
  onSubmit: () => void;
  loading: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View>
      <TouchableOpacity style={styles.buttonSubmit}>
        <Button
          style={{ opacity: loading ? 0.8 : 1 }}
          loading={loading}
          onPress={() => onSubmit()}
          buttonColor={colors.primary}
          textColor={customTheme.colors.light}
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>
      </TouchableOpacity>

      <View style={styles.loginLinkContainer}>
        <Text
          variant="labelSmall"
          style={styles.loginLink}
          onPress={() => router.push(isLogin ? "/auth/register" : "/auth")}
        >
          {isLogin ? "Não tem conta?cadastro" : "Já tem conta?entrar"}
        </Text>
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
    flexShrink: 1,
    padding: 8,
    color: customTheme.colors["primary-600"],
    textDecorationColor: customTheme.colors["primary-600"],
    textDecorationLine: "underline",
  },
});
