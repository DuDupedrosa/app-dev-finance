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

const StepsEnum = {
  USER_DATA: 1,
  USER_CHANGE_PASSWORD: 2,
};

export default function ProfileScreen() {
  const translateX = useSharedValue(300);
  const { user, token } = useLocalSearchParams<DefaultRouterParams>();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(StepsEnum.USER_DATA);

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

  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          {userData && !loading && (
            <View>
              <View>
                <Text variant="headlineLarge" style={styles.title}>
                  Olá, {userData.name}
                </Text>
                <Text variant="labelLarge" style={styles.subtitle}>
                  Edite os detalhes da sua conta para garantir que tudo esteja
                  correto e atualizado.
                </Text>

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
                          : customTheme.colors["blue-600"]
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
                          : customTheme.colors["blue-600"]
                      }
                    >
                      Alterar senha
                    </Button>
                  </TouchableOpacity>
                </View>
              </View>

              {step === StepsEnum.USER_DATA && (
                <BasicFormData token={token} userData={userData} />
              )}
              {step === StepsEnum.USER_CHANGE_PASSWORD && (
                <FormChangePassword token={token} />
              )}
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

  tabsButtonContainer: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 32,
  },
  tabsButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: customTheme.colors["blue-600"],
    flex: 1,
  },
  tabsButtonActive: {
    backgroundColor: customTheme.colors["blue-600"],
    borderWidth: 1,
    borderColor: customTheme.colors["blue-600"],
    flex: 1,
  },
});
