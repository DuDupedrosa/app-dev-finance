import { customTheme } from "@/theme/theme";
import { DefaultRouterParams } from "@/types/defaultRouterParams";
import { User } from "@/types/user";
import {
  Link,
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getUserData } from "@/helpers/methods/asyncStorage";
import Feather from "@expo/vector-icons/Feather";

export default function homePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  function handleRedirect() {
    if (token && token.length && token !== "logout") {
      router.push("/(tabs)");
      return;
    }

    router.push("/auth");
  }

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        const user = await getUserData();

        if (user) {
          if (user.token) setToken(user.token);
          if (user.username) setUserName(user.username);
        }
      };
      loadUserData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.moneyIcon}>
              <MaterialIcons
                name="attach-money"
                size={32}
                color={customTheme.colors["green-600"]}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleRedirect()}
              style={styles.loginButton}
            >
              {userName && userName.length > 0 && (
                <Feather
                  name="user"
                  size={24}
                  color={customTheme.colors["gray-400"]}
                />
              )}
              <Text
                variant="labelLarge"
                style={{
                  textAlign: "center",
                  color: customTheme.colors["gray-400"],
                }}
              >
                {userName && userName.length > 0 ? userName : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text
              variant="headlineMedium"
              style={{
                color: customTheme.colors["gray-50"],
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Controle seus Gastos com Facilidade
            </Text>
            <Text
              variant="labelLarge"
              style={{
                color: customTheme.colors["gray-400"],
                textAlign: "center",
              }}
            >
              Organize suas finanças mensais de forma prática e eficiente.
              Registre despesas, acompanhe seus gastos e tome o controle do seu
              orçamento com nosso aplicativo intuitivo.
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/finance-2.jpg")} // Atualize o caminho da imagem
              style={styles.image}
              resizeMode="contain" // Ou 'cover', dependendo do layout
            />
          </View>

          <TouchableOpacity
            onPress={() => handleRedirect()}
            style={{
              marginTop: 32,
              width: 220,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Button
              buttonColor={customTheme.colors["primary-600"]}
              textColor={customTheme.colors.light}
            >
              Acessar plataforma
            </Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: customTheme.colors["gray-900"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 32,
    borderBottomWidth: 2,
    borderBottomColor: customTheme.colors["gray-800"],
  },
  loginButton: {
    backgroundColor: customTheme.colors["gray-900"],
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: customTheme.colors["primary-600"],
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    alignSelf: "flex-start", // Garante que o botão não ocupe 100% da largura do container,
    maxWidth: 300,
    minWidth: 80,
    justifyContent: "center",
  },
  moneyIcon: {
    borderRadius: 100,
    borderWidth: 1,
    padding: 4,
    borderColor: customTheme.colors["green-600"],
    alignContent: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 20,
  },
  image: {
    width: "80%", // Ajuste para o tamanho desejado
    height: 200, // Ajuste para o tamanho desejado
    borderRadius: 20,
  },
  imageContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});
