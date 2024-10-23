import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper";
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
import BasicFormData from "@/ui/tabs/profile/BasicFormData";
import FormChangePassword from "@/ui/tabs/profile/FormChangePassword";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import PageSpinner from "@/ui/components/PageSpinner";
import { getUserData } from "@/helpers/methods/asyncStorage";

const StepsEnum = {
  USER_DATA: 1,
  USER_CHANGE_PASSWORD: 2,
};

export default function ProfileScreen() {
  const translateX = useSharedValue(300);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(StepsEnum.USER_DATA);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });

    const loadUserData = async () => {
      const user = await getUserData();

      if (user) {
        if (user.token) setToken(user.token);
        if (user.username) setUsername(user.username);
      }
    };
    loadUserData();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
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

    if (token) {
      getUserData();
    }
  }, [token]);

  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          {(username || (userData && !loading)) && (
            <>
              <Text variant="headlineMedium" style={styles.title}>
                Olá, {username ?? userData?.name}
              </Text>
              <Text variant="labelMedium" style={styles.subtitle}>
                Edite os detalhes da sua conta para garantir que tudo esteja
                correto e atualizado.
              </Text>
            </>
          )}
          {userData && !loading && (
            <View>
              <View>
                <View style={styles.tabsButtonContainer}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setStep(StepsEnum.USER_DATA)}
                  >
                    <Button
                      style={
                        step === StepsEnum.USER_DATA
                          ? styles.tabsButtonActive
                          : styles.tabsButton
                      }
                      textColor={
                        step === StepsEnum.USER_DATA
                          ? customTheme.colors.light
                          : customTheme.colors["gray-600"]
                      }
                    >
                      Básico
                    </Button>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setStep(StepsEnum.USER_CHANGE_PASSWORD)}
                  >
                    <Button
                      style={
                        step === StepsEnum.USER_CHANGE_PASSWORD
                          ? styles.tabsButtonActive
                          : styles.tabsButton
                      }
                      textColor={
                        step === StepsEnum.USER_CHANGE_PASSWORD
                          ? customTheme.colors.light
                          : customTheme.colors["gray-600"]
                      }
                    >
                      Alterar senha
                    </Button>
                  </TouchableOpacity>
                </View>
              </View>

              {step === StepsEnum.USER_DATA && (
                <BasicFormData
                  token={token}
                  userData={userData}
                  onSuccess={(editedUser) => {
                    let edited = { ...userData, ...editedUser };
                    setUserData(edited);
                  }}
                />
              )}
              {step === StepsEnum.USER_CHANGE_PASSWORD && (
                <FormChangePassword token={token} />
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>
      {loading && <PageSpinner />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    color: customTheme.colors.black,
  },
  subtitle: {
    color: customTheme.colors["gray-800"],
    fontWeight: "400",
    marginTop: 8,
  },

  tabsButtonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 64,
    marginBottom: 32,
  },
  tabsButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: customTheme.colors["gray-600"],
    flex: 1,
  },
  tabsButtonActive: {
    backgroundColor: customTheme.colors["gray-600"],
    borderWidth: 1,
    borderColor: customTheme.colors["gray-600"],
    flex: 1,
  },
});
