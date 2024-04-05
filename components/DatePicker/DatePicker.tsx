import { useState, FC } from "react";
import {
  SafeAreaView,
  Button,
  Text,
  Alert,
  View,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type AndroidMode = "date" | "time";

interface IDatePickerProps {
  date: Date;
  setSelectedDate: (date: Date) => void;
}

//select time and select date buttons should be replaced or adjusted with icons
export const DatePicker: FC<IDatePickerProps> = ({ setSelectedDate, date }) => {
  const [mode, setMode] = useState<AndroidMode>("date");
  const [show, setShow] = useState(false);

  const onChange = (e: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate ?? new Date();
    setShow(false);
    Alert.alert("selected date:", currentDate.toString());
    setSelectedDate(currentDate);
  };

  const showMode = (currentMode: AndroidMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <View style={styles.initiateDateSelectionButton}>
            <Button onPress={showDatepicker} title="Select date" />
          </View>
          <View style={styles.initiateDateSelectionButton}>
            <Button onPress={showTimepicker} title="Select time" />
          </View>
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
  container: {
    position: "relative",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 50
  },
  initiateDateSelectionButton: {
    flexGrow: 1,
    marginRight: 5,
    width: "50%",
  },
  currentlySelectedDate: {
    position: "absolute",
    top: 75,
    textAlign: "center",
  },
});
