import { ColorItem } from "../models";

export const DEFAULT_COLOR = "#fbeee0";

export const DEFAULT_COLORS: ColorItem[] = [
  { value: "#FF5733", label: "Красный" },
  { value: "#33FF57", label: "Зеленый" },
  { value: "#3357FF", label: "Синий" },
  { value: "#F1C40F", label: "Желтый" },
  { value: "#9B59B6", label: "Фиолетовый" },
];

export const getColorItem = (colorValue?: string) => {
  if (colorValue) {
    return DEFAULT_COLORS.filter((color) => color.value === colorValue)[0]
      ?.value;
  }
};
