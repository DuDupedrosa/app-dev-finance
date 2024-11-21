import { customTheme } from "@/theme/theme";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { format, getMonth } from "date-fns";
import { getUserData } from "@/helpers/methods/asyncStorage";
import { ExpenseDataType } from "@/types/expense";
import { http } from "@/api/http";
import { formatDateHelper } from "@/helpers/methods/formatDate";
import { formatCurrencyBRL } from "@/helpers/methods/formatCurrency";
import getCategoryStyles from "@/helpers/methods/getCategoryStyles";
import GetExpenseIcon from "@/ui/components/GetExpenseIcon";
import { useNavigation, router } from "expo-router";
import NotFoundItems from "@/ui/components/NotFondItems";
import { ptBR } from "date-fns/locale";

export default function HomeComponent() {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<number>(
    getMonth(new Date())
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<ExpenseDataType[] | null>(null);
  const [total, setTotal] = useState<number>(0);

  async function getExpensesTotal() {
    setLoading(true);
    try {
      const { data } = await http.get(`expense/total-month/${currentMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotal(data.content.total);
    } catch (err) {}
    setLoading(false);
  }

  async function getExpenses() {
    setLoading(true);
    try {
      const originUrl = `expense/list-all?month=${currentMonth}?maxSize=10`;

      const { data } = await http.get(originUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data.content);
    } catch (err) {}
    setLoading(false);
  }

  useEffect(() => {
    const loadUserData = async () => {
      const user = await getUserData();

      if (user) {
        if (user.token) setToken(user.token);
        if (user.username) setUsername(user.username);
      }
    };
    loadUserData();
    setCurrentMonth(getMonth(new Date()));
  }, []);

  useEffect(() => {
    if (token && token.length) {
      getExpenses();
      getExpensesTotal();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {username && username.length > 0 && (
          <View>
            <Text variant="headlineLarge" style={styles.title}>
              Olá, {username}{" "}
              <MaterialIcons
                name="waving-hand"
                size={24}
                color={customTheme.colors["yellow-500"]}
              />
            </Text>

            <Text variant="labelSmall" style={styles.subtitle}>
              Última atualização:{" "}
              {format(new Date(), "dd MMM yyyy, HH:mm", { locale: ptBR })}
            </Text>
          </View>
        )}
        {loading && (
          <View style={{ marginTop: 64 }}>
            <ActivityIndicator
              size={"large"}
              animating={true}
              color={customTheme.colors["primary-600"]}
            />
          </View>
        )}
        {!loading && (
          <View>
            <View style={styles.cardMain}>
              <View style={styles.cardMainHeader}>
                <View>
                  <Text
                    variant="labelLarge"
                    style={{ color: customTheme.colors["custom-gray-1"] }}
                  >
                    Despesas recentes
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={{
                      color: customTheme.colors["custom-gray-1"],
                      marginTop: 4,
                      fontWeight: "bold",
                    }}
                  >
                    Período:{" "}
                    <Text
                      variant="labelMedium"
                      style={{
                        color: customTheme.colors["custom-gray-1"],
                      }}
                    >
                      {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
                    </Text>
                  </Text>
                </View>

                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="attach-money"
                    size={24}
                    color={customTheme.colors["green-600"]}
                  />
                </View>
              </View>
              <Text variant="headlineMedium" style={styles.expenseValue}>
                {formatCurrencyBRL(total)}
              </Text>
            </View>

            <View>
              <View style={styles.listExpenseHeader}>
                <Text
                  variant="labelLarge"
                  style={{
                    fontWeight: "600",
                    color: customTheme.colors["gray-900"],
                  }}
                >
                  Atividades recentes
                </Text>

                {expenses && expenses.length > 0 && (
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/expenses")}
                    style={styles.seeMoreContainer}
                  >
                    <Text style={styles.seeMore}>Ver mais</Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color={customTheme.colors["primary-600"]}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.listContainer}>
                {/* item */}
                {expenses &&
                  expenses.length > 0 &&
                  expenses.map((expense, i) => {
                    return (
                      <View key={i}>
                        <View style={styles.listItem}>
                          {/* imagem + nome */}
                          <View style={styles.listItemFirstColumn}>
                            <View
                              style={{
                                ...styles.listIcon,
                                backgroundColor: getCategoryStyles(
                                  expense.categoryId
                                ).boxColor,
                              }}
                            >
                              {
                                <GetExpenseIcon
                                  expenseEnum={expense.categoryId}
                                />
                              }
                            </View>
                            <Text
                              variant="labelMedium"
                              style={styles.categoryTitle}
                            >
                              {getCategoryStyles(expense.categoryId).label}
                            </Text>
                          </View>

                          {/* valor + data */}
                          <View style={styles.listItemSecondColumn}>
                            <View style={styles.listItemValueAndDateContainer}>
                              <Text
                                variant="labelMedium"
                                style={styles.listItemExpenseValue}
                              >
                                {formatCurrencyBRL(expense.value)}
                              </Text>
                              <Text
                                variant="labelSmall"
                                style={styles.listItemExpenseDate}
                              >
                                {formatDateHelper(
                                  expense.date,
                                  "dd MMM yyyy, HH:mm"
                                )}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        )}

        {!loading && (!expenses || expenses.length <= 0) && (
          <NotFoundItems dashboard={true} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },

  title: {
    color: customTheme.colors["gray-900"],
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    color: customTheme.colors["custom-gray-1"],
  },
  cardMain: {
    borderRadius: 12, // Cantos arredondados
    backgroundColor: "#fff", // Fundo branco
    shadowColor: "#000", // Cor da sombra
    shadowOffset: { width: 0, height: 4 }, // Posição da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 4, // Raio da sombra
    elevation: 4, // Sombra para Android
    padding: 16, // Espaçamento interno
    marginTop: 32,
  },
  expenseValue: {
    marginTop: 20,
    fontWeight: "bold",
    color: customTheme.colors["green-600"],
  },
  cardMainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 100,
    borderColor: customTheme.colors["green-600"],
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    padding: 4,
  },
  listExpenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
  },
  seeMore: {
    color: customTheme.colors["primary-600"],
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: customTheme.colors["red-600"],
    justifyContent: "center",
    alignItems: "center",
  },
  listItemFirstColumn: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  listItemSecondColumn: {
    flexDirection: "row",
    gap: 20,
  },
  listItemExpenseValue: {
    color: customTheme.colors.black,
    fontWeight: "bold",
  },
  listItemExpenseDate: {
    color: customTheme.colors["gray-600"],
  },
  listContainer: {
    gap: 32,
    marginTop: 32,
  },
  categoryTitle: {
    color: customTheme.colors.black,
    fontWeight: "bold",
  },
  listItemValueAndDateContainer: {
    alignItems: "flex-end",
  },
});
