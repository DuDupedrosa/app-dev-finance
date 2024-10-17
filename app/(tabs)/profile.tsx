import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { customTheme } from "@/theme/theme";
import { useLocalSearchParams } from "expo-router";
import { DefaultRouterParams } from "@/types/defaultRouterParams";
import { http } from "@/api/http";
import { User } from "@/types/user";
import { Controller, useForm } from "react-hook-form";
import InputErroMessage from "@/ui/components/InputErroMessage";

type FormData = {
  name: string;
  email: string;
  lastName?: string | undefined;
  cellphone?: string | undefined;
};

interface UserDataToUpdate {
  name: string;
  lastName?: string | null;
  email: string;
  cellphone?: string | null;
  id?: string;
}

export default function ProfileScreen() {
  const translateX = useSharedValue(300);
  const { user, token } = useLocalSearchParams<DefaultRouterParams>();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedLoading, setUpdatedLoading] = useState<boolean>(false);

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
    setValue,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (userDataToUpdate) => {
    setUpdatedLoading(true);
    try {
      let payload: UserDataToUpdate = { ...userDataToUpdate };

      if (!payload.lastName) {
        payload.lastName = null;
      }

      if (!payload.cellphone) {
        payload.cellphone = null;
      }

      if (userData) {
        payload.id = userData.id;
      }

      const { data } = await http.put("user", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {}
    setUpdatedLoading(false);
  });

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      try {
        const { data } = await http.get("user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(data.content);
      } catch (err) {}
      setLoading(false);
    }

    getUserData();
  }, [token]);

  useEffect(() => {
    if (userData) {
      const { name, lastName, email, cellphone } = userData;
      setValue("name", name);
      setValue("email", email);

      if (lastName) setValue("lastName", lastName);

      if (cellphone) setValue("cellphone", cellphone);
    }
  }, [userData]);

  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          {userData && !loading && (
            <View>
              <Text variant="headlineLarge" style={styles.title}>
                Olá, {userData.name}
              </Text>
              <Text variant="labelLarge" style={styles.subtitle}>
                Edite os detalhes da sua conta para garantir que tudo esteja
                correto e atualizado.
              </Text>

              <View style={styles.formContainer}>
                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text variant="labelLarge" style={styles.label}>
                          Nome*
                        </Text>

                        <TextInput
                          mode="outlined"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          style={{ height: 44 }}
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text variant="labelLarge" style={styles.label}>
                          Sobrenome
                        </Text>

                        <TextInput
                          mode="outlined"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          style={{ height: 44 }}
                        />
                      </>
                    )}
                    name="lastName"
                  />
                </View>

                <View>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text variant="labelLarge" style={styles.label}>
                          Email*
                        </Text>

                        <TextInput
                          mode="outlined"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          style={{ height: 44 }}
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text variant="labelLarge" style={styles.label}>
                          Celular
                        </Text>

                        <TextInput
                          mode="outlined"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          style={{ height: 44 }}
                        />
                      </>
                    )}
                    name="cellphone"
                  />
                </View>

                <TouchableOpacity>
                  <Button
                    loading={updatedLoading}
                    onPress={() => onSubmit()}
                    buttonColor={customTheme.colors["primary-600"]}
                    textColor={customTheme.colors.light}
                  >
                    Editar
                  </Button>
                </TouchableOpacity>
              </View>
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
  title: {
    color: customTheme.colors.black,
  },
  subtitle: {
    color: customTheme.colors["gray-800"],
    fontWeight: "400",
    marginTop: 8,
  },
  formContainer: {
    gap: 20,
    marginTop: 32,
  },
  label: {
    color: customTheme.colors["gray-800"],
    marginBottom: 8,
  },
});
