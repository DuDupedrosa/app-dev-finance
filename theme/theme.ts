import { DefaultTheme } from "react-native-paper";
const dark = "#000000";
const light = "#ffffff";

export const theme = {
  ...DefaultTheme, // Baseado no tema padrão
  colors: {
    ...DefaultTheme.colors,
    primary: "#16A34A", // Cor primária (verde)
    secondary: "#3B82F6", // Cor secundária (azul) - você pode trocar para a cor que preferir
    accent: "#03dac4", // Cor de destaque, você pode personalizar se desejar
    background: light, // Cor de fundo do app (branco)
    text: dark, // Cor principal do texto (preto)
    surface: light, // Fundo dos cards e outras superfícies (branco)
    light: light,
  },
};

export const customTheme = {
  colors: {
    light: light,
    black: dark,
    "red-600": "#DC2626",
    "primary-600": "#16A34A",
    "primary-500": "#22c55e",

    // gray
    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",

    // custom-gray
    "custom-gray-1": "#4A4A4A",
    "custom-gray-2": "#6e6e6e ",
    "custom-gray-3": "#9e9e9e ",

    //blue
    "blue-400": "#60a5fa",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "blue-800": "#1e40af",

    "green-500": "#22c55e",
    "green-600": "#16A34A",

    "yellow-400": "#facc15",
    "yellow-500": "#eab308",
    "yellow-600": "#ca8a04",
  },
};
