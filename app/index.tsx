import { DefaultRouterParams } from "@/types/defaultRouterParams";
import { User } from "@/types/user";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function homePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const { user, token } = useLocalSearchParams<DefaultRouterParams>();

  useEffect(() => {
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, [user]);

  return (
    <SafeAreaView style={style.safeArea}>
      <View>
        <Text>HOME</Text>
        {userData && (
          <Text>
            {userData.id} {userData.name}
          </Text>
        )}
        <Text>{token}</Text>

        <Link href={"/(tabs)"}>Tabs</Link>

        <Link href={"/(tabs)/addSpent"}>Dispesa</Link>

        <Link href={"/auth"}>vamos para o login</Link>
        <Button mode="contained" buttonColor="#1f2" icon={"camera"}>
          {" "}
          VAMOS?
        </Button>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
