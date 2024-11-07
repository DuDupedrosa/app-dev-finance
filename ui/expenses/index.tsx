import { customTheme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { monthsListToDropdown } from "@/helpers/data/monthList";
import { getUserData } from "@/helpers/methods/asyncStorage";
import { http } from "@/api/http";
import { ExpenseDataType } from "@/types/expense";
import getCategoryStyles from "@/helpers/methods/getCategoryStyles";
import { formatDateHelper } from "@/helpers/methods/formatDate";
import { formatCurrencyBRL } from "@/helpers/methods/formatCurrency";

export default function ExpensesComponent() {
  const [month, setMonth] = useState<string>();
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [expenses, setExpenses] = useState<ExpenseDataType[]>([]);

  const CustomInput = (props: any) => (
    <TextInput
      {...props}
      mode="outlined"
      style={styles.input} // Você pode estilizar o input aqui
      value={month}
    />
  );

  async function getExpenses() {
    try {
      const { data } = await http.get("expense/list-all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(data.content);
    } catch (err) {}
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
  }, []);

  useEffect(() => {
    if (token && token.length) {
      getExpenses();
    }
  }, [token]);

  return (
    <ScrollView>
      <View style={styles.container}>
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
          <Button
            textColor={customTheme.colors.light}
            buttonColor={customTheme.colors["primary-600"]}
          >
            Nova transação
          </Button>
        </View>

        {/* lista */}
        <View style={styles.listContainer}>
          {/* item */}
          {expenses &&
            expenses.length > 0 &&
            expenses.map((expense, i) => {
              return (
                <View style={styles.listItem} key={i}>
                  {/* imagem + nome */}
                  <View style={styles.listItemFirstColumn}>
                    <View
                      style={{
                        ...styles.listIcon,
                        backgroundColor: getCategoryStyles(expense.categoryId)
                          .boxColor,
                      }}
                    >
                      <Ionicons
                        name="fast-food-sharp"
                        size={20}
                        color={getCategoryStyles(expense.categoryId).iconColor}
                      />
                    </View>
                    <Text variant="labelMedium" style={styles.categoryTitle}>
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
                        {formatDateHelper(expense.date, "dd MMM yyyy, HH:mm")}
                      </Text>
                    </View>
                    <TouchableOpacity>
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
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  referenceMonthContainer: {
    marginTop: 32,
  },
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
