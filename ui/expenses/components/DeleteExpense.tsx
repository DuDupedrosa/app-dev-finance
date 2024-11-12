import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { customTheme } from "@/theme/theme";

export default function DeleteExpense({
  onClose,
  onDelete,
  formattedDate,
  formattedValue,
  loading,
}: {
  onClose: () => void;
  onDelete: () => void;
  formattedValue: string;
  formattedDate: string;
  loading: boolean;
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: 150, // Defina a altura final do componente aqui
      duration: 300,
      useNativeDriver: false, // Aqui deve ser false, pois estamos animando a altura
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.deleteContainer, { height: heightAnim }]}>
      <Text
        variant="labelMedium"
        style={{
          color: customTheme.colors["gray-900"],
          textAlign: "center",
        }}
      >
        Você tem certeza que deseja deletar a transação no valor de{" "}
        <Text variant="labelMedium" style={{ fontWeight: "bold" }}>
          {formattedValue} do dia {formattedDate}?
        </Text>
      </Text>

      <View style={styles.deleteButtonsContainer}>
        {loading ? (
          <ActivityIndicator
            size={"small"}
            animating={true}
            color={customTheme.colors["primary-600"]}
          />
        ) : (
          <>
            <TouchableOpacity>
              <View style={[styles.deleteButton, styles.deleteButtonConfirm]}>
                <Text
                  onPress={() => onDelete()}
                  variant="labelSmall"
                  style={{ color: customTheme.colors.light }}
                >
                  Sim, deletar
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClose()}>
              <View style={[styles.deleteButton, styles.deleteButtonCanceled]}>
                <Text variant="labelSmall">Não, cancelar</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deleteContainer: {
    overflow: "hidden", // Esconde o conteúdo enquanto expande
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customTheme.colors["red-600"],
    marginTop: 8,
    padding: 12,
    justifyContent: "center",
  },
  deleteButtonsContainer: {
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
    gap: 20,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  deleteButtonConfirm: {
    backgroundColor: customTheme.colors["red-600"],
    borderColor: customTheme.colors["red-600"],
  },
  deleteButtonCanceled: {
    backgroundColor: "#fffff",
    borderColor: customTheme.colors["red-600"],
  },
});