import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para salvar dados no AsyncStorage
export const storeUserData = async (token: string, username: string) => {
  try {
    await AsyncStorage.multiSet([
      ["token", token],
      ["username", username],
    ]);
  } catch (e) {}
};

interface GetUserData {
  token: string | null;
  username: string | null;
}
// Função para buscar os dados armazenados
export const getUserData = async (): Promise<GetUserData | null> => {
  try {
    const data = await AsyncStorage.multiGet(["token", "username"]);
    const token = data[0][1]; // Token salvo
    const username = data[1][1]; // Nome de usuário salvo
    return { token, username };
  } catch (e) {
    return null;
  }
};
