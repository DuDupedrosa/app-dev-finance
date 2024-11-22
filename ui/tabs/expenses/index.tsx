import { customTheme } from "@/theme/theme";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  monthListEnumAndValue,
  monthsListToDropdown,
} from "@/helpers/data/monthList";
import { getUserData } from "@/helpers/methods/asyncStorage";
import { http } from "@/api/http";
import { ExpenseDataType } from "@/types/expense";
import getCategoryStyles from "@/helpers/methods/getCategoryStyles";
import { formatDateHelper } from "@/helpers/methods/formatDate";
import { formatCurrencyBRL } from "@/helpers/methods/formatCurrency";
import GetExpenseIcon from "../../components/GetExpenseIcon";
import { getMonth } from "date-fns";
import { useNavigation, router, useFocusEffect } from "expo-router";
import DeleteExpense from "./components/DeleteExpense";
import NotFoundItems from "../../components/NotFondItems";
import Toast from "react-native-toast-message";
import PageTitle from "@/ui/components/PageTitle";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function ExpensesComponent() {
  const opacity = useSharedValue(0); // Para fade-in
  const scale = useSharedValue(0.95); // Para efeito de crescimento
  const [animationKey, setAnimationKey] = useState(0);
  const [month, setMonth] = useState<string>();
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [expenses, setExpenses] = useState<ExpenseDataType[] | null>(null);
  const [firstGetExpense, setFirstGetExpense] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<number>(
    getMonth(new Date())
  );
  const { navigate } = useNavigation();
  const [deleteExpense, setDeleteExpense] = useState<{
    id: number;
    value: number;
    date: string;
    index: number;
  } | null>(null);
  const [deleteExpenseLoading, setDeleteExpenseLoading] =
    useState<boolean>(false);

  const CustomInput = (props: any) => (
    <TextInput
      {...props}
      mode="outlined"
      style={styles.input} // Você pode estilizar o input aqui
      value={month}
    />
  );

  async function getExpenses({ month }: { month: number | null }) {
    setLoading(true);
    try {
      const originUrl = "expense/list-all";
      let filterUrl = originUrl;

      if (month !== null && month >= 0) {
        filterUrl = `${originUrl}?month=${month}`;
      } else {
        filterUrl = originUrl;
      }

      const { data } = await http.get(filterUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data.content);
    } catch (err) {}
    setLoading(false);
  }

  function setMonthToCurrent() {
    const findMonth = monthListEnumAndValue.find(
      (monthObject) => monthObject.enum === currentMonth
    );
    setMonth(findMonth?.label);
  }

  function handleDeleteExpense(expense: ExpenseDataType, index: number) {
    setDeleteExpense({
      id: expense.id,
      value: expense.value,
      date: expense.date,
      index,
    });
  }

  async function deleteExpenseSubmit() {
    setDeleteExpenseLoading(true);
    try {
      if (!deleteExpense) return;

      await http.delete(`expense/${deleteExpense.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteExpense(null);
      Toast.show({
        type: "success", // outros tipos: 'error', 'info'
        text1: "Sucesso",
        text2: "Transação deletada com sucesso.",
      });
      await getExpenses({ month: currentMonth });
    } catch (err) {}
    setDeleteExpenseLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        const user = await getUserData();

        if (user) {
          if (user.token) setToken(user.token);
          if (user.username) setUsername(user.username);
        }
      };
      loadUserData();
      setCurrentMonth(getMonth(new Date()));

      return () => {
        // Limpeza, se necessário
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
      if (token && token.length) {
        setMonthToCurrent();
        getExpenses({ month: currentMonth });
        // Reinicia a animação
        setAnimationKey((prevKey) => prevKey + 1);
        opacity.value = 0; // Reinicia a opacidade
        scale.value = 0.95; // Reinicia a escala

        opacity.value = withTiming(1, {
          duration: 600,
          easing: Easing.ease,
        });
        scale.value = withTiming(1, {
          duration: 600,
          easing: Easing.ease,
        });
      }
    }, [token])
  );

  useEffect(() => {
    if (!token || token.length <= 0) return;

    const findMonthToFilter = monthListEnumAndValue.find(
      (monthObject) => monthObject.label === month
    );
    // se já tiver feito o primeiro get no create do componente
    if (findMonthToFilter) {
      getExpenses({ month: findMonthToFilter.enum });
    } else {
      getExpenses({ month: currentMonth });
      setMonthToCurrent();
    }
  }, [month]);

  return (
    <ScrollView>
      <Animated.View
        key={animationKey}
        style={[styles.container, animatedStyle]}
      >
        <PageTitle title="Meus Gastos e Despesas" />

        <View style={styles.referenceMonthContainer}>
          <Text variant="labelLarge" {...styles.referenceMonthLabel}>
            Mês de referência
          </Text>

          <Dropdown
            placeholder="Selecione um mês"
            options={monthsListToDropdown}
            value={month}
            onSelect={setMonth}
            menuContentStyle={{ backgroundColor: "#fff" }}
            CustomDropdownInput={CustomInput} // Passando o input personalizado
          />
        </View>

        <View style={styles.headerList}>
          <Text variant="headlineSmall">Transações</Text>

          {!loading && expenses && expenses.length > 0 && (
            <TouchableOpacity>
              <Button
                onPress={() => router.push("/(tabs)/addSpent")}
                textColor={customTheme.colors.light}
                buttonColor={customTheme.colors["primary-600"]}
              >
                Nova transação
              </Button>
            </TouchableOpacity>
          )}
        </View>

        {!loading && (!expenses || expenses.length <= 0) && <NotFoundItems />}

        {/* lista */}
        {!loading && (
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
                          {<GetExpenseIcon expenseEnum={expense.categoryId} />}
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
                        <TouchableOpacity
                          onPress={() => handleDeleteExpense(expense, i)}
                        >
                          <View style={styles.listItemDeleteButton}>
                            <AntDesign
                              name="delete"
                              size={20}
                              color={customTheme.colors["red-600"]}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {deleteExpense && deleteExpense.index === i && (
                      <DeleteExpense
                        onDelete={async () => deleteExpenseSubmit()}
                        loading={deleteExpenseLoading}
                        formattedDate={formatDateHelper(
                          expense.date,
                          "dd MMM yyyy, HH:mm"
                        )}
                        formattedValue={formatCurrencyBRL(expense.value)}
                        onClose={() => setDeleteExpense(null)}
                      />
                    )}
                  </View>
                );
              })}
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
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    flex: 1,
    marginTop: 32,
  },
  referenceMonthContainer: {},
  referenceMonthLabel: {
    color: customTheme.colors.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    height: 44,
  },
  headerList: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
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
  listItemDeleteButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customTheme.colors["red-600"],
    justifyContent: "center",
    alignItems: "center",
  },
  listItemValueAndDateContainer: {
    alignItems: "flex-end",
  },
  categoryTitle: {
    color: customTheme.colors.black,
    fontWeight: "bold",
  },
});
