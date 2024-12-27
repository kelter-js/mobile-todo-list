import { FC } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { DEFAULT_COLORS } from "../../utils/getColorItem";
import { ColorPickerProps } from "./types";

export const ColorPicker: FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите цвет выделения задачи</Text>

      <View style={styles.list}>
        {DEFAULT_COLORS.map((color) => {
          const isColorSelected = selectedColor === color.value;
          const handleSelectColor = () => onSelectColor(color.value);

          return (
            <Pressable
              onPress={handleSelectColor}
              style={[
                styles.colorItem,
                {
                  backgroundColor: isColorSelected
                    ? color.value
                    : "rgb(41, 50, 56)",
                },
              ]}
            >
              <Text style={styles.colorItemText}>{color.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 22, marginBottom: 22 },
  colorItem: {
    flex: 1,
    flexGrow: 0.4,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minWidth: 60,
  },
  colorItemText: { color: "#93989b", alignSelf: "center" },
  title: { color: "#a5a6a7", fontWeight: "600", fontSize: 18 },
  list: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 10 },
});
