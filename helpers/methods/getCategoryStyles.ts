import { CategoryTypeEnum } from "../enums/categoryEnum";

export default function getCategoryStyles(categoryId: number) {
  const literal = {
    [CategoryTypeEnum.FOOD]: {
      label: "Alimentação",
      iconColor: "#ffffff",
      boxColor: "#2563eb",
    },
    [CategoryTypeEnum.TRANSPORT]: {
      label: "Transporte",
      iconColor: "#ffffff",
      boxColor: "#ea580c",
    },
    [CategoryTypeEnum.HOUSING]: {
      label: "Moradia",
      iconColor: "#ffffff",
      boxColor: "#d97706",
    },
    [CategoryTypeEnum.SERVICES]: {
      label: "Serviços",
      iconColor: "#ffffff",
      boxColor: "#9333ea",
    },
    [CategoryTypeEnum.HEALTH]: {
      label: "Saúde",
      iconColor: "#ffffff",
      boxColor: "#65a30d",
    },
    [CategoryTypeEnum.EDUCATION]: {
      label: "Educação",
      iconColor: "#ffffff",
      boxColor: "#16a34a",
    },
    [CategoryTypeEnum.RECREATION]: {
      label: "Lazer",
      iconColor: "#ffffff",
      boxColor: "##c026d3",
    },
    [CategoryTypeEnum.CLOTHES]: {
      label: "Vestuário",
      iconColor: "#ffffff",
      boxColor: "#4f46e5",
    },
    [CategoryTypeEnum.SHOPPING]: {
      label: "Compras",
      iconColor: "#ffffff",
      boxColor: "#7c3aed",
    },
    [CategoryTypeEnum.TAXES]: {
      label: "Impostos",
      iconColor: "#ffffff",
      boxColor: "#db2777",
    },
  };

  return literal[categoryId];
}
