import { Picker } from "@react-native-picker/picker";
import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScheduleSelectionProps } from "./types";

export const ScheduleSelection: FC<ScheduleSelectionProps> = ({
  onSelectSchedule,
  selectedScheduleType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Отображать напоминания каждые:</Text>
      {/* <Picker
        selectedValue={selectedScheduleType}
        onValueChange={onSelectSchedule}
        style={[styles.input, styles.titleInput]}
        selectionColor="#28A745"
      >
        {DEFAULT_COLORS.map(({ label, value }) => (
          <Picker.Item key={value} label={label} value={value} color={value} />
        ))}
      </Picker> */}
      <Text style={styles.text}>С периодичностью в:</Text>
      {/* <Picker
        selectedValue={selectedScheduleType}
        onValueChange={onSelectSchedule}
        style={[styles.input, styles.titleInput]}
        selectionColor="#28A745"
      >
        {DEFAULT_COLORS.map(({ label, value }) => (
          <Picker.Item key={value} label={label} value={value} color={value} />
        ))}
      </Picker> */}
    </View>
  );
};

const styles = StyleSheet.create({
  text: { color: "rgb(165, 166, 167)", fontSize: 16, fontWeight: "600" },
  container: { flex: 1, gap: 16 },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    height: 51,
  },
  titleInput: {
    marginBottom: 0,
  },
});
