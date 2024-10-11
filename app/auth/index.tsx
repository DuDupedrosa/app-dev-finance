import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AuthPageTitle from "@/ui/auth/AuthPageTitle";
import AuthBackPageIcon from "@/ui/auth/AuthBackPageIcon";
import AuthActionButtonAndLink from "@/ui/auth/AuthActionButtonAndLink";
import { Controller, useForm } from "react-hook-form";
import InputErroMessage from "@/ui/components/InputErroMessage";
import { AlertDefaultData } from "@/types/alert";
import AlertComponent from "@/ui/components/AlertComponents";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const translateX = useSharedValue(300);
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertDefaultData>({
    isVisible: false,
    text: "",
  });

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    console.warn(data);
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          <AuthBackPageIcon onBack={() => router.push("/")} />

          <AuthPageTitle title="Entrar" />

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
                    <Text variant="labelLarge">Email*</Text>

                    <TextInput
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </>
                )}
                name="email"
              />
              {errors.email && <InputErroMessage />}
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
                      onBlur={onBlur}
                      onChangeText={onChange}
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

              {alert.isVisible && (
                <AlertComponent
                  type="erro"
                  text={alert.text}
                  onClose={() => setAlert({ isVisible: false, text: "" })}
                />
              )}

              <AuthActionButtonAndLink
                isLogin={true}
                onSubmit={() => onSubmit()}
              />
            </View>
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
