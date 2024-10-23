import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { customTheme } from "@/theme/theme";
import { Dropdown } from "react-native-paper-dropdown";
import { getUserData } from "@/helpers/methods/asyncStorage";
import { Controller, useForm } from "react-hook-form";
import InputErroMessage from "@/ui/components/InputErroMessage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format, sub } from "date-fns";
import CurrencyInput from "react-native-currency-input";

const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export default function AddSpent() {
  const translateX = useSharedValue(300);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [gender, setGender] = useState<string>();

  // data
  const [date, setDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  //hora
  const [hours, setHours] = useState<Date | null>(null);
  const [showHours, setShowHours] = useState<boolean>(false);

  //valor
  const [spentValue, setSpentValue] = useState<number | null>(0);

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

  function submit() {
    let data = {
      gender,
      hours,
      date,
      spentValue,
    };

    console.warn(data);
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const CustomInput = (props: any) => (
    <TextInput
      {...props}
      mode="outlined"
      style={styles.input} // Você pode estilizar o input aqui
      value={gender}
    />
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginBottom: 32 }}>
            <Text variant="headlineMedium" style={styles.title}>
              Adicionar novo gasto
            </Text>
            <Text variant="labelMedium" style={styles.subtitle}>
              Preencha os campos abaixo, para salvar uma nova transação.
            </Text>
          </View>

          {/* form */}
          <View style={styles.formContainer}>
            {/* tratamento a parte */}
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Categoria
              </Text>

              <Dropdown
                placeholder="Selecione uma categoria"
                options={OPTIONS}
                value={gender}
                onSelect={setGender}
                menuContentStyle={{ backgroundColor: "#fff" }}
                CustomDropdownInput={CustomInput} // Passando o input personalizado
              />
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
            </View>
            <View>
              <Text variant="labelLarge" style={styles.label}>
                Valor
              </Text>
              <CurrencyInput
                value={spentValue}
                onChangeValue={setSpentValue}
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
            </View>

            <TouchableOpacity>
              <Button
                onPress={() => submit()}
                buttonColor={customTheme.colors["primary-600"]}
                textColor={customTheme.colors.light}
              >
                Editar
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
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
