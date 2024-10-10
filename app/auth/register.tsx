import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, useTheme } from "react-native-paper";
import PasswordRolesList from "@/ui/components/PasswordRolesList";
import { router } from "expo-router";
import { useState } from "react";
import AuthPageTitle from "@/ui/auth/AuthPageTitle";
import AuthBackPageIcon from "@/ui/auth/AuthBackPageIcon";
import AuthActionButtonAndLink from "@/ui/auth/AuthActionButtonAndLink";

export default function RegisterPage() {
  const { colors } = useTheme();
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <AuthBackPageIcon onBack={() => router.push("/auth")} />

          <AuthPageTitle title="Cadastro" />

          {/* form */}
          <View style={styles.formContainer}>
            <View>
              <Text variant="labelLarge">Nome*</Text>
              <TextInput mode="outlined" />
            </View>
            <View>
              <Text variant="labelLarge">Email*</Text>
              <TextInput mode="outlined" />
            </View>
            <View>
              <Text variant="labelLarge">Senha*</Text>
              <TextInput
                mode="outlined"
                secureTextEntry={hiddenPassword}
                right={
                  <TextInput.Icon
                    icon={hiddenPassword ? "eye" : "eye-off"}
                    onPress={() => setHiddenPassword(!hiddenPassword)}
                  />
                }
              />
            </View>

            <PasswordRolesList />

            <AuthActionButtonAndLink isLogin={false} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  formContainer: {
    flexDirection: "column",
    gap: 20,
    marginTop: 32,
  },
});
