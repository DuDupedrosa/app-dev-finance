import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import PasswordRolesList from "@/ui/components/PasswordRolesList";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AuthPageTitle from "@/ui/auth/AuthPageTitle";
import AuthBackPageIcon from "@/ui/auth/AuthBackPageIcon";
import AuthActionButtonAndLink from "@/ui/auth/AuthActionButtonAndLink";
import { useForm, Controller } from "react-hook-form";
import InputErroMessage from "@/ui/components/InputErroMessage";
import { validatePassword } from "@/helpers/validator/validatorPassword";
import { regexpEmail } from "@/helpers/regexp/email";
import AlertComponent, {
  defaultErroMessage,
} from "@/ui/components/AlertComponents";
import { AlertDefaultData } from "@/types/alert";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { http } from "@/api/http";
import axios, { HttpStatusCode } from "axios";
import { customTheme } from "@/theme/theme";
import httpErroKeysMessage from "@/helpers/data/httpErroKeysMessage";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const translateX = useSharedValue(300);
  const { colors } = useTheme();
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [validPassword, setValidPassword] = useState<
    boolean | { enum: number; key: string }
  >(true);
  const [alert, setAlert] = useState<AlertDefaultData>({
    isVisible: false,
    text: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [successRegister, setSuccessRegister] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();

  function resetForm() {
    setValue("email", "");
    setValue("name", "");
    setValue("password", "");
  }

  const onSubmit = handleSubmit(async (userData) => {
    if (loading) return;

    setLoading(true);
    setSuccessRegister(false);

    try {
      if (!isValidEmail()) {
        setLoading(false);
        return;
      }

      if (typeof handleValidatePassword() === "object") {
        setLoading(false);
        return;
      }

      let payload = { ...userData };

      await http.post(`user/register`, payload);
      resetForm();
      setSuccessRegister(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status) {
          setAlert({
            isVisible: true,
            text: httpErroKeysMessage.internal_server_erro,
          });
        }
      }
    }
    setLoading(false);
  });

  function isValidEmail() {
    const email = getValues("email");
    const emailRegex = regexpEmail;
    const valid = emailRegex.test(email);
    setValidEmail(valid);
    return valid;
  }

  function handleValidatePassword() {
    const password = getValues("password");
    const result = validatePassword(password);

    setValidPassword(result);
    return result;
  }

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          <AuthBackPageIcon onBack={() => router.push("/auth")} />

          <AuthPageTitle title="Cadastro" />

          {/* form */}
          <View style={styles.formContainer}>
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Text variant="labelLarge">Nome*</Text>

                    <TextInput
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </>
                )}
                name="name"
              />
              {errors.name && <InputErroMessage />}
            </View>

            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Text variant="labelLarge">Email*</Text>

                    <TextInput
                      mode="outlined"
                      onBlur={() => {
                        onBlur();

                        isValidEmail();
                      }}
                      onChangeText={(email) => {
                        onChange(email);

                        if (!validEmail) {
                          isValidEmail();
                        }
                      }}
                      value={value}
                    />
                  </>
                )}
                name="email"
              />
              {errors.email && <InputErroMessage />}
              {!validEmail && <InputErroMessage label="Email inválido" />}
            </View>

            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Text variant="labelLarge">Senha*</Text>

                    <TextInput
                      mode="outlined"
                      onBlur={() => {
                        onBlur();
                        handleValidatePassword();
                      }}
                      onChangeText={(password) => {
                        onChange(password);

                        if (typeof validPassword === "object") {
                          handleValidatePassword();
                        }
                      }}
                      value={value}
                      secureTextEntry={hiddenPassword}
                      right={
                        <TextInput.Icon
                          icon={hiddenPassword ? "eye" : "eye-off"}
                          onPress={() => setHiddenPassword(!hiddenPassword)}
                        />
                      }
                    />
                  </>
                )}
                name="password"
              />
              {errors.password && <InputErroMessage />}
              {typeof validPassword === "object" && (
                <InputErroMessage label={validPassword.key} />
              )}
            </View>

            <PasswordRolesList />

            {alert.isVisible && (
              <AlertComponent
                type="erro"
                text={alert.text}
                onClose={() => setAlert({ isVisible: false, text: "" })}
              />
            )}

            {!successRegister && (
              <AuthActionButtonAndLink
                loading={loading}
                isLogin={false}
                onSubmit={() => onSubmit()}
              />
            )}
          </View>

          {successRegister && (
            <View style={{ gap: 20, marginVertical: 20 }}>
              <AlertComponent
                outline={true}
                type="success"
                text={
                  "Cadastro realizado com sucesso! Agora, clique no botão abaixo para fazer login com suas credenciais."
                }
              />
              <Button
                onPress={() => router.push("/auth")}
                buttonColor={colors.primary}
                textColor={customTheme.colors.light}
              >
                Entrar na plataforma
              </Button>
            </View>
          )}
        </Animated.View>
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
