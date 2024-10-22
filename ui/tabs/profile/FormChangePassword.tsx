import { http } from "@/api/http";
import httpErroKeysMessage from "@/helpers/data/httpErroKeysMessage";
import { validatePassword } from "@/helpers/validator/validatorPassword";
import { customTheme } from "@/theme/theme";
import { AlertDefaultData, AlertDefaultType } from "@/types/alert";
import AlertComponent from "@/ui/components/AlertComponents";
import InputErroMessage from "@/ui/components/InputErroMessage";
import PasswordRolesList from "@/ui/components/PasswordRolesList";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";

type FormData = {
  currentPassword: string;
  newPassword: string;
};

export default function FormChangePassword({ token }: { token: string }) {
  const [validPassword, setValidPassword] = useState<
    boolean | { enum: number; key: string }
  >(true);
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);
  const [hiddenCurrentPassword, setHiddenCurrentPassword] =
    useState<boolean>(true);
  const [alert, setAlert] = useState<AlertDefaultData>({
    isVisible: false,
    text: "",
  });
  const [alertType, setAlertType] = useState<AlertDefaultType>("success");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();

  function submitOnSuccess() {
    setValue("currentPassword", "");
    setValue("newPassword", "");
  }

  const onSubmit = handleSubmit(async (passwordToUpdate) => {
    if (
      typeof handleValidatePassword(passwordToUpdate.newPassword) !== "boolean"
    )
      return;

    if (loading) return;
    setAlert({ isVisible: false, text: "" });
    setLoading(true);
    try {
      let payload: { currentPassword: string; newPassword: string } = {
        ...passwordToUpdate,
      };

      await http.put("user/changePassword", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      submitOnSuccess();
      setAlertType("success");
      setAlert({ isVisible: true, text: "Senha alterada com sucesso!" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errResp = err.response;

        if (errResp) {
          setAlertType("erro");
          if (errResp.status !== HttpStatusCode.InternalServerError) {
            const errorKey = errResp.data
              .message as keyof typeof httpErroKeysMessage;
            const httpKey = httpErroKeysMessage[errorKey];

            setAlert({
              isVisible: true,
              text: httpKey ? httpErroKeysMessage[errorKey] : errorKey,
            });
          } else {
            setAlert({
              isVisible: true,
              text: httpErroKeysMessage.internal_server_erro,
            });
          }
        }
      }
    }
    setLoading(false);
  });

  function handleValidatePassword(passwordToValid?: string): boolean | object {
    const password = getValues("newPassword");
    const result = validatePassword(passwordToValid ?? password);

    setValidPassword(result);

    return result;
  }

  return (
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
                Senha atual*
              </Text>

              <TextInput
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{ height: 44 }}
                secureTextEntry={hiddenCurrentPassword}
                right={
                  <TextInput.Icon
                    icon={hiddenCurrentPassword ? "eye" : "eye-off"}
                    onPress={() =>
                      setHiddenCurrentPassword(!hiddenCurrentPassword)
                    }
                  />
                }
              />
            </>
          )}
          name="currentPassword"
        />
        {errors.currentPassword && <InputErroMessage />}
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
                Nova senha*
              </Text>

              <TextInput
                mode="outlined"
                onBlur={() => {
                  onBlur();
                  handleValidatePassword();
                }}
                onChangeText={(password) => {
                  onChange(password);

                  if (typeof validPassword === "object") {
                    handleValidatePassword();
                  }
                }}
                value={value}
                style={{ height: 44 }}
                secureTextEntry={hiddenPassword}
                right={
                  <TextInput.Icon
                    icon={hiddenPassword ? "eye" : "eye-off"}
                    onPress={() => setHiddenPassword(!hiddenPassword)}
                  />
                }
              />
            </>
          )}
          name="newPassword"
        />
        {errors.newPassword && <InputErroMessage />}
        {typeof validPassword === "object" && (
          <InputErroMessage label={validPassword.key} />
        )}
      </View>

      <PasswordRolesList />

      {alert.isVisible && (
        <AlertComponent
          type={alertType}
          text={alert.text}
          onClose={() => setAlert({ isVisible: false, text: "" })}
        />
      )}

      <TouchableOpacity>
        <Button
          loading={loading}
          onPress={() => onSubmit()}
          buttonColor={customTheme.colors["primary-600"]}
          textColor={customTheme.colors.light}
        >
          Atualizar senha
        </Button>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 20,
  },
  label: {
    color: customTheme.colors["gray-800"],
    marginBottom: 8,
  },
});
