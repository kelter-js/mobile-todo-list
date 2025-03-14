import { useState, FC } from "react";
import {
  SafeAreaView,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { DatePickerProps, AndroidMode } from "./types";

export const DatePicker: FC<DatePickerProps> = ({ setSelectedDate, date }) => {
  const [mode, setMode] = useState<AndroidMode>("date");
  const [show, setShow] = useState(false);

  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate ?? new Date();
    setShow(false);
    Alert.alert("selected date:", currentDate.toString());
    setSelectedDate(currentDate);
  };

  const showMode = (currentMode: AndroidMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => showMode("date");

  const showTimepicker = () => showMode("time");

  return (
    <SafeAreaView>
      <View style={styles.buttonsMainContainer}>
        <View style={[styles.initiateDateSelectionButton, styles.firstButton]}>
          <TouchableOpacity
            onPress={showTimepicker}
            style={styles.buttonContainer}
          >
            <Ionicons name="timer" size={24} color="rgb(165, 166, 167)" />
          </TouchableOpacity>
        </View>

        <View style={styles.initiateDateSelectionButton}>
          <TouchableOpacity
            onPress={showDatepicker}
            style={styles.buttonContainer}
          >
            <FontAwesome name="calendar" size={24} color="rgb(165, 166, 167)" />
          </TouchableOpacity>
        </View>
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonsMainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 36,
    width: 80,
  },
  firstButton: {
    marginRight: 7,
  },
  initiateDateSelectionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    borderRadius: 12,
    border: "1px solid rgb(165, 166, 167)",
  },
});
