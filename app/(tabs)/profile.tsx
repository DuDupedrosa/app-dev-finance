import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useCallback, useState } from "react";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { customTheme } from "@/theme/theme";
import { useFocusEffect } from "expo-router";
import { http } from "@/api/http";
import { User } from "@/types/user";
import BasicFormData from "@/ui/tabs/profile/BasicFormData";
import FormChangePassword from "@/ui/tabs/profile/FormChangePassword";
import PageSpinner from "@/ui/components/PageSpinner";
import { getUserData } from "@/helpers/methods/asyncStorage";
import BreadCrumb from "@/ui/components/BreadCrumb";
import PageTitle from "@/ui/components/PageTitle";

const StepsEnum = {
  USER_DATA: 1,
  USER_CHANGE_PASSWORD: 2,
};

function ActiveButton({ label }: { label: string }) {
  return (
    <Button
      style={styles.tabsButtonActive}
      textColor={customTheme.colors.light}
    >
      {label}
    </Button>
  );
}

function InActiveButton({ label }: { label: string }) {
  return (
    <Button
      style={styles.tabsButton}
      textColor={customTheme.colors["gray-600"]}
    >
      {label}
    </Button>
  );
}

export default function ProfileScreen() {
  const translateX = useSharedValue(300);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(StepsEnum.USER_DATA);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
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

      return () => {
        // Limpeza, se necessário
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        setLoading(true);
        try {
          const { data } = await http.get("user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserData(data.content);
        } catch (err) {}
        setLoading(false);
      };

      if (token && token.length) {
        getUserData();
      }
    }, [token])
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <BreadCrumb route="Meu perfil" />
      <ScrollView>
        <Animated.View style={[styles.container, animatedStyle]}>
          <PageTitle title="Configurações de Perfil" />

          {userData && !loading && (
            <View>
              <View>
                <View style={styles.tabsButtonContainer}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setStep(StepsEnum.USER_DATA)}
                  >
                    {step === StepsEnum.USER_DATA && (
                      <ActiveButton label="Básico" />
                    )}
                    {step !== StepsEnum.USER_DATA && (
                      <InActiveButton label="Básico" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setStep(StepsEnum.USER_CHANGE_PASSWORD)}
                  >
                    {step === StepsEnum.USER_CHANGE_PASSWORD && (
                      <ActiveButton label="Alterar senha" />
                    )}
                    {step !== StepsEnum.USER_CHANGE_PASSWORD && (
                      <InActiveButton label="Alterar senha" />
                    )}
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    flex: 1,
    marginTop: 32,
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
