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
  },
};
