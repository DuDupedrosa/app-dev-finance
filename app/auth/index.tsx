import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import AuthPageTitle from "@/ui/auth/AuthPageTitle";
import AuthBackPageIcon from "@/ui/auth/AuthBackPageIcon";
import AuthActionButtonAndLink from "@/ui/auth/AuthActionButtonAndLink";

export default function LoginPage() {
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <AuthBackPageIcon onBack={() => router.push("/")} />

          <AuthPageTitle title="Entrar" />

          {/* form */}
          <View style={styles.formContainer}>
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

            <AuthActionButtonAndLink isLogin={true} />
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
