import { router } from "expo-router";

import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const http = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => {
    // Caso a requisição seja bem-sucedida
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === axios.HttpStatusCode.Unauthorized
    ) {
      // Redireciona para a tela de login quando o status for 401 (não autorizado)
      router.push("/auth");
    }

    // Retorna o erro para que possa ser tratado normalmente em outros lugares
    return Promise.reject(error);
  }
);
