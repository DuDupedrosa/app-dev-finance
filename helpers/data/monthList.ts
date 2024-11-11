import { MonthOptionsToFilterEnum } from "../enums/monthEnum";

const monthsToLabel = {
  january: "Janeiro",
  february: "Fevereiro",
  march: "Março",
  april: "Abril",
  may: "Maio",
  june: "Junho",
  july: "Julho",
  august: "Agosto",
  september: "Setembro",
  october: "Outubro",
  november: "Novembro",
  dezember: "Dezembro",
};
export const monthsListToDropdown = [
  {
    label: monthsToLabel.january,
    value: monthsToLabel.january,
  },
  {
    label: monthsToLabel.february,
    value: monthsToLabel.february,
  },
  {
    label: monthsToLabel.march,
    value: monthsToLabel.march,
  },
  {
    label: monthsToLabel.april,
    value: monthsToLabel.april,
  },
  {
    label: monthsToLabel.may,
    value: monthsToLabel.may,
  },
  {
    label: monthsToLabel.june,
    value: monthsToLabel.june,
  },
  {
    label: monthsToLabel.july,
    value: monthsToLabel.july,
  },
  {
    label: monthsToLabel.august,
    value: monthsToLabel.august,
  },
  {
    label: monthsToLabel.september,
    value: monthsToLabel.september,
  },
  {
    label: monthsToLabel.october,
    value: monthsToLabel.october,
  },
  {
    label: monthsToLabel.november,
    value: monthsToLabel.november,
  },
  {
    label: monthsToLabel.dezember,
    value: monthsToLabel.dezember,
  },
];

export const monthListEnumAndValue = [
  {
    enum: MonthOptionsToFilterEnum.JANUARY,
    label: monthsToLabel.january,
  },
  {
    enum: MonthOptionsToFilterEnum.FEBRUARY,
    label: monthsToLabel.february,
  },
  {
    enum: MonthOptionsToFilterEnum.MARCH,
    label: monthsToLabel.march,
  },
  {
    enum: MonthOptionsToFilterEnum.APRIL,
    label: monthsToLabel.april,
  },
  {
    enum: MonthOptionsToFilterEnum.MAY,
    label: monthsToLabel.may,
  },
  {
    enum: MonthOptionsToFilterEnum.JUNE,
    label: monthsToLabel.june,
  },
  {
    enum: MonthOptionsToFilterEnum.JULY,
    label: monthsToLabel.july,
  },
  {
    enum: MonthOptionsToFilterEnum.AUGUST,
    label: monthsToLabel.august,
  },
  {
    enum: MonthOptionsToFilterEnum.SEPTEMBER,
    label: monthsToLabel.september,
  },
  {
    enum: MonthOptionsToFilterEnum.OCTOBER,
    label: monthsToLabel.october,
  },
  {
    enum: MonthOptionsToFilterEnum.NOVEMBER,
    label: monthsToLabel.november,
  },
  {
    enum: MonthOptionsToFilterEnum.DECEMBER,
    label: monthsToLabel.dezember,
  },
];
