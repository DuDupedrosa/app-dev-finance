import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, useTheme } from "react-native-paper";
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
import AlertComponent from "@/ui/components/AlertComponents";
import { AlertDefaultData } from "@/types/alert";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    if (!validEmail) return;
    if (typeof validPassword === "object") return;

    console.warn(data);
  });

  function isValidEmail() {
    const email = getValues("email");
    const emailRegex = regexpEmail;
    setValidEmail(emailRegex.test(email));
  }

  function handleValidatePassword() {
    const password = getValues("password");
    const result = validatePassword(password);

    setValidPassword(result);
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

            <AuthActionButtonAndLink
              isLogin={false}
              onSubmit={() => onSubmit()}
            />
          </View>
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
