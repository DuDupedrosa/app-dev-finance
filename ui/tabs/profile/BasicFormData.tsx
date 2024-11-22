import { customTheme } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputErroMessage from "@/ui/components/InputErroMessage";
import AlertComponent from "@/ui/components/AlertComponents";
import httpErroKeysMessage from "@/helpers/data/httpErroKeysMessage";
import { regexpEmail } from "@/helpers/regexp/email";
import { AlertDefaultData, AlertDefaultType } from "@/types/alert";
import { User } from "@/types/user";
import { http } from "@/api/http";
import { router } from "expo-router";
import DeleteExpense from "../expenses/components/DeleteExpense";
import Animated from "react-native-reanimated";
import DeleteAccountCard from "./DeleteAccountCard";
import Toast from "react-native-toast-message";
import { storeUserData } from "@/helpers/methods/asyncStorage";

interface UserDataToUpdate {
  name: string;
  lastName?: string | null;
  email: string;
  cellphone?: string | null;
  id?: string;
}

type FormData = {
  name: string;
  email: string;
  lastName?: string | undefined;
  cellphone?: string | undefined;
};

export default function BasicFormData({
  token,
  userData,
  onSuccess,
}: {
  token: string;
  userData: User | null;
  onSuccess: (editedUser: Partial<User>) => void;
}) {
  const [updatedLoading, setUpdatedLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertDefaultData>({
    isVisible: false,
    text: "",
  });
  const [alertType, setAlertType] = useState<AlertDefaultType>("success");
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [deleteAccountLoading, setDeleteAccountLoading] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();

  function submitOnSuccess(data: User) {
    const { name, lastName, email, cellphone } = data;
    setValue("name", name);
    setValue("lastName", lastName ?? "");
    setValue("email", email);
    setValue("cellphone", cellphone ?? "");

    onSuccess(data);
  }

  async function deleteAccountAsync() {
    setDeleteAccountLoading(true);
    try {
      await http.delete("user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({
        type: "success", // outros tipos: 'error', 'info'
        text1: "Sucesso",
        text2: "Conta deleta com sucesso.",
      });
      storeUserData("", "");
      router.push("/auth");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Um erro aconteceu, tente novamente mais tarde.",
      });
    }
    setDeleteAccountLoading(false);
  }

  const onSubmit = handleSubmit(async (userDataToUpdate) => {
    if (!isValidEmail(userDataToUpdate.email)) return;

    setUpdatedLoading(true);
    setAlert({ isVisible: false, text: "" });
    try {
      let payload: UserDataToUpdate = { ...userDataToUpdate };

      if (!payload.lastName) {
        payload.lastName = null;
      }

      if (!payload.cellphone) {
        payload.cellphone = null;
      }

      if (userData) {
        payload.id = userData.id;
      }

      const { data } = await http.put("user", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      submitOnSuccess(data.content);
      setAlertType("success");
      setAlert({
        isVisible: true,
        text: "Todas as informações foram salvas com sucesso.",
      });
    } catch (err) {
      setAlertType("erro");
      setAlert({
        isVisible: true,
        text: httpErroKeysMessage.internal_server_erro,
      });
    }
    setUpdatedLoading(false);
  });

  function isValidEmail(emailToValid?: string): boolean {
    const email = getValues("email");
    const emailRegex = regexpEmail;
    const validEmail = emailRegex.test(emailToValid ?? email);
    setValidEmail(validEmail);
    return validEmail;
  }

  useEffect(() => {
    if (userData) {
      const { name, lastName, email, cellphone } = userData;
      setValue("name", name);
      setValue("email", email);
      if (lastName) setValue("lastName", lastName);

      if (cellphone) setValue("cellphone", cellphone);
    }
  }, [userData]);

  return (
    <>
      {userData && (
        <View style={styles.formContainer}>
          <View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text variant="labelLarge" style={styles.label}>
                    Nome*
                  </Text>

                  <TextInput
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ height: 44 }}
                  />
                </>
              )}
              name="name"
            />
            {errors.name && <InputErroMessage />}
          </View>

          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text variant="labelLarge" style={styles.label}>
                    Sobrenome
                  </Text>

                  <TextInput
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ height: 44 }}
                  />
                </>
              )}
              name="lastName"
            />
          </View>

          <View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text variant="labelLarge" style={styles.label}>
                    Email*
                  </Text>

                  <TextInput
                    mode="outlined"
                    onBlur={() => {
                      onBlur();

                      isValidEmail();
                    }}
                    onChangeText={(email) => {
                      onChange(email);

                      if (!validEmail) {
                        isValidEmail();
                      }
                    }}
                    value={value}
                    style={{ height: 44 }}
                  />
                </>
              )}
              name="email"
            />
            {errors.email && <InputErroMessage />}
            {!validEmail && <InputErroMessage label="Email inválido" />}
          </View>

          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text variant="labelLarge" style={styles.label}>
                    Celular
                  </Text>

                  <TextInput
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ height: 44 }}
                  />
                </>
              )}
              name="cellphone"
            />
          </View>

          {alert.isVisible && (
            <AlertComponent
              type={alertType}
              text={alert.text}
              onClose={() => setAlert({ isVisible: false, text: "" })}
            />
          )}

          <TouchableOpacity>
            <Button
              loading={updatedLoading}
              onPress={() => onSubmit()}
              buttonColor={customTheme.colors["primary-600"]}
              textColor={customTheme.colors.light}
            >
              Salvar alterações
            </Button>
          </TouchableOpacity>

          {deleteAccount && (
            <DeleteAccountCard
              loading={deleteAccountLoading}
              onDelete={async () => await deleteAccountAsync()}
              onCancel={() => setDeleteAccount(false)}
            />
          )}

          <TouchableOpacity>
            <Button
              onPress={() => setDeleteAccount(true)}
              mode="outlined"
              textColor={customTheme.colors["red-600"]}
              style={styles.buttonDeleteAccount}
            >
              Deletar conta
            </Button>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttonDeleteAccount: {
    borderColor: customTheme.colors["red-600"], // Borda vermelha
    borderWidth: 2, // Espessura da borda
    backgroundColor: "transparent", // Fundo transparente
  },
  formContainer: {
    gap: 20,
  },
  label: {
    color: customTheme.colors["gray-800"],
    marginBottom: 8,
  },
});
