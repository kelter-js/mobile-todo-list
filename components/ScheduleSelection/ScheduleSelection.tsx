import { FC } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet } from "react-native";
import { ScheduleSelectionProps } from "./types";
import { INTERVAL_TYPE_RANGES, INTERVAL_TYPES } from "./constants";

export const ScheduleSelection: FC<ScheduleSelectionProps> = ({
  onSelectSchedule,
  selectedScheduleType,
  selectedScheduleFrequency,
  onSelectFrequency,
}) => (
  <View style={styles.container}>
    <Text style={styles.text}>Отображать напоминания каждые несколько:</Text>

    <Picker
      selectedValue={selectedScheduleType}
      onValueChange={onSelectSchedule}
      style={[styles.input, styles.titleInput]}
      selectionColor="#28A745"
    >
      {INTERVAL_TYPES.map((type) => (
        <Picker.Item key={type} label={type} value={type} />
      ))}
    </Picker>

    <Text style={styles.text}>С периодичностью в:</Text>

    <Picker
      selectedValue={selectedScheduleFrequency}
      onValueChange={onSelectFrequency}
      style={[styles.input, styles.titleInput]}
      selectionColor="#28A745"
    >
      {INTERVAL_TYPE_RANGES[INTERVAL_TYPES.indexOf(selectedScheduleType)].map(
        (value) => (
          <Picker.Item key={value} label={String(value)} value={value} />
        )
      )}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  text: { color: "rgb(165, 166, 167)", fontSize: 16, fontWeight: "600" },
  container: { flex: 1, gap: 16 },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#293238",
    color: "rgb(165, 166, 167)",
    borderRadius: 5,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    height: 51,
  },
  titleInput: {
    marginBottom: 0,
  },
});
