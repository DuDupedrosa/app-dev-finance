import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { customTheme } from "@/theme/theme";
import { Dropdown } from "react-native-paper-dropdown";
import { getUserData } from "@/helpers/methods/asyncStorage";
import InputErroMessage from "@/ui/components/InputErroMessage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import CurrencyInput from "react-native-currency-input";
import { http } from "@/api/http";
import { AlertDefaultData, AlertDefaultType } from "@/types/alert";
import AlertComponent from "@/ui/components/AlertComponents";
import BreadCrumb from "@/ui/components/BreadCrumb";
import PageTitle from "@/ui/components/PageTitle";
import { useFocusEffect } from "expo-router";

export default function AddSpent() {
  const [animationKey, setAnimationKey] = useState(0);
  const opacity = useSharedValue(0); // Para fade-in
  const scale = useSharedValue(0.95); // Para efeito de crescimento
  const translateX = useSharedValue(300);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [alert, setAlert] = useState<AlertDefaultData>({
    isVisible: false,
    text: "",
  });
  const [alertType, setAlertType] = useState<AlertDefaultType>("success");

  // cenários de required
  const [requiredCategory, setRequiredCategory] = useState<boolean>(false);
  const [requiredDate, setRequiredDate] = useState<boolean>(false);
  const [requiredHours, setRequiredHours] = useState<boolean>(false);
  const [requiredValue, setRequiredValue] = useState<boolean>(false);
  //end

  //categorias
  // categorias filtradas para o select
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  // mantém oq vem do back
  const [categoriesData, setCategoriesData] = useState<
    { name: string; id: number }[]
  >([]);
  const [category, setCategory] = useState<string>();
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  // data
  const [date, setDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  //hora
  const [hours, setHours] = useState<Date | null>(null);
  const [showHours, setShowHours] = useState<boolean>(false);

  //valor
  const [expenseValue, setExpenseValue] = useState<number | null>(0);

  // manipulando a data
  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === "ios"); // No iOS, o picker continua visível até que o usuário o feche
    setDate(currentDate); // Atualiza a data selecionada
  };

  const showDatepicker = () => {
    setShowDate(true);
  };
  // end

  // manipulando a hora
  const onChangeHours = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    const currentDate = selectedDate || hours;
    setShowHours(Platform.OS === "ios"); // No iOS, o picker continua visível até que o usuário o feche
    setHours(currentDate); // Atualiza a data selecionada
  };

  const showHoursPicker = () => {
    setShowHours(true);
  };
  // end

  function resetForm() {
    setHours(null);
    setDate(null);
    setExpenseValue(null);
    setCategory(undefined);
  }

  function validateInputsOnSubmit(): boolean {
    let validate = true;

    if (!category || category.length <= 0) {
      setRequiredCategory(true);
      validate = false;
    }

    if (!date) {
      setRequiredDate(true);
      validate = false;
    }

    if (!hours) {
      setRequiredHours(true);
      validate = false;
    }

    if (!expenseValue || expenseValue <= 0) {
      setRequiredValue(true);
      validate = false;
    }

    return validate;
  }

  async function submit() {
    try {
      // reset states on submit
      setAlert({ isVisible: false, text: "" });
      setLoading(true);
      setRequiredCategory(false);
      setRequiredDate(false);
      setRequiredHours(false);
      setRequiredValue(false);
      // end

      if (!validateInputsOnSubmit()) {
        setLoading(false);
        return;
      }

      let payload: {
        categoryId: number | undefined;
        time: string;
        date: string;
        expenseValue: number;
      } = {
        categoryId: categoriesData.find(
          (categoryItem) => categoryItem.name === category
        )?.id,
        time: hours ? format(hours, "HH:mm") : "",
        date: date ? format(date, "yyyy-MM-dd") : "",
        expenseValue: Number(expenseValue),
      };
      await http.post("expense", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      resetForm();
      setAlertType("success");
      setAlert({
        isVisible: true,
        text: "Novo gasto registrado com sucesso! Você pode acessar a dashboard ou meus gastos para conferir os detalhes da transação.",
      });
      setLoading(false);
    } catch (err) {
      setAlertType("erro");
      setAlert({
        isVisible: true,
        text: "Um erro aconteceu, tente novamente mais tarde",
      });
      setLoading(false);
    }
  }

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

  useEffect(() => {
    const getCategories = async () => {
      setCategoryLoading(true);
      try {
        const { data } = await http.get("expense/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategoriesData(data.content);
        const filteredCategories = data.content.map(
          (category: { name: string; id: number }) => {
            return {
              label: category.name,
              value: String(category.name),
            };
          }
        );

        setCategories(filteredCategories);
      } catch (err) {}
      setCategoryLoading(false);
    };

    if (token && token.length && categories.length <= 0) {
      getCategories();
    }
  }, [token]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
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
    }, [token])
  );

  const CustomInput = (props: any) => (
    <TextInput
      {...props}
      mode="outlined"
      style={styles.input} // Você pode estilizar o input aqui
      value={category}
    />
  );

  // controlando o estado de required na mudança do estado
  useEffect(() => {
    if (category && category.length) {
      setRequiredCategory(false);
    }
  }, [category]);

  useEffect(() => {
    if (hours) {
      setRequiredHours(false);
    }
  }, [hours]);

  useEffect(() => {
    if (date) {
      setRequiredDate(false);
    }
  }, [date]);

  useEffect(() => {
    if (expenseValue && expenseValue > 0) {
      setRequiredValue(false);
    }
  }, [expenseValue]);
  //end
  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ScrollView>
        <BreadCrumb route="Nova transação" />

        <Animated.View
          key={animationKey}
          style={[styles.container, animatedStyle]}
        >
          <PageTitle title="Adicionar Nova Despesa" />
          {/* form */}
          <View style={styles.formContainer}>
            {/* tratamento a parte */}
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Categoria
              </Text>
              {categoryLoading && (
                <ActivityIndicator
                  size={"small"}
                  style={{
                    alignItems: "flex-start",
                  }}
                  animating={true}
                  color={customTheme.colors["primary-600"]}
                />
              )}

              {categories.length > 0 && !categoryLoading && (
                <Dropdown
                  placeholder="Selecione uma categoria"
                  options={categories}
                  value={category}
                  onSelect={setCategory}
                  menuContentStyle={{ backgroundColor: "#fff" }}
                  CustomDropdownInput={CustomInput} // Passando o input personalizado
                />
              )}
              {requiredCategory && <InputErroMessage />}
            </View>

            {/* data */}
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Data
              </Text>
              <TouchableOpacity onPress={() => showDatepicker()}>
                <TextInput
                  mode="outlined"
                  editable={false}
                  value={date ? format(date, "dd/MM/yyyy") : ""}
                  style={{ height: 44 }}
                  placeholder="Selecione uma data"
                />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  value={date ? date : new Date()} // Data atual selecionada
                  mode="date" // Ou 'time' para hora
                  display="default" // Estilo de exibição ('default', 'spinner', 'calendar', etc.)
                  onChange={onChangeDate} // Função chamada quando a data/hora muda
                />
              )}
              {requiredDate && <InputErroMessage />}
            </View>

            {/* hora */}
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Hora
              </Text>
              <TouchableOpacity onPress={() => showHoursPicker()}>
                <TextInput
                  mode="outlined"
                  editable={false}
                  value={hours ? format(hours, "HH:mm") : ""}
                  style={{ height: 44 }}
                  placeholder="Selecione um horário"
                />
              </TouchableOpacity>
              {showHours && (
                <DateTimePicker
                  value={hours ? hours : new Date()}
                  mode="time"
                  display="default"
                  onChange={onChangeHours}
                />
              )}
              {requiredHours && <InputErroMessage />}
            </View>
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Valor
              </Text>
              <CurrencyInput
                value={expenseValue}
                onChangeValue={setExpenseValue}
                prefix="R$ "
                delimiter="."
                separator=","
                precision={2}
                renderTextInput={(props) => {
                  // Removendo propriedades que causam erro de tipo
                  const {
                    cursorColor,
                    selectionColor,
                    editable,
                    style,
                    ...otherProps
                  } = props;

                  return (
                    <TextInput
                      {...otherProps}
                      mode="outlined"
                      style={[
                        { backgroundColor: "transparent", height: 44 },
                        style,
                      ]} // Aplica o estilo corretamente
                      keyboardType="numeric"
                    />
                  );
                }}
              />
              {requiredValue && <InputErroMessage />}
            </View>

            {alert.isVisible && (
              <View style={{ marginTop: 20 }}>
                <AlertComponent
                  type={alertType}
                  text={alert.text}
                  onClose={() => setAlert({ isVisible: false, text: "" })}
                />
              </View>
            )}

            <TouchableOpacity>
              <Button
                onPress={() => submit()}
                buttonColor={customTheme.colors["primary-600"]}
                textColor={customTheme.colors.light}
                loading={loading}
              >
                Adicionar
              </Button>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
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
  input: {
    backgroundColor: "#fff",
    height: 44,
  },
  label: {
    color: customTheme.colors["gray-800"],
    marginBottom: 8,
  },
  formContainer: {
    gap: 20,
  },
  buttonPickDate: {
    borderWidth: 1,
    borderRadius: 4,
  },
});
