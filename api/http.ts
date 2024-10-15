import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const http = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
