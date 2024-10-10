import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function homePage() {
  return (
    <SafeAreaView style={style.safeArea}>
      <View>
        <Text>HOME</Text>
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
