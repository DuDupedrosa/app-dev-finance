import { customTheme } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";

export default function NotFoundItems({ dashboard }: { dashboard?: boolean }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="labelLarge" style={styles.alertText}>
          {dashboard
            ? "Parece que você ainda não possui nenhuma despesa cadastrada no mês atual. Clique no botão abaixo para registrar uma nova transação ou clique em meus gastos, para visualizar seu histórico."
            : "Parece que você ainda não possui nenhuma despesa cadastrada ou não há despesas no mês selecionado. Clique no botão abaixo para registrar uma nova transação ou ajuste o filtro para outro mês de referência."}
        </Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/addSpent")}>
          <Button
            textColor={customTheme.colors.light}
            buttonColor={customTheme.colors["primary-600"]}
          >
            Nova transação
          </Button>
        </TouchableOpacity>
        {dashboard && (
          <TouchableOpacity
            style={{ marginTop: 12 }}
            onPress={() => router.push("/(tabs)/expenses")}
          >
            <Button
              textColor={customTheme.colors["custom-gray-1"]}
              mode="outlined"
            >
              Meus gastos
            </Button>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customTheme.colors["gray-900"],
    marginTop: 32,
  },
  content: {
    justifyContent: "center",
  },
  alertText: {
    color: customTheme.colors["gray-900"],
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 32,
  },
});
