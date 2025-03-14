import {
  Pressable,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useCallback, useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "../DatePicker";
import DateDisplay from "../DateDisplay";
import { useStateContext } from "../../context/StateContext";

const removeButtonDescription = (isViewModeInProgress: boolean) =>
  isViewModeInProgress ? (
    <>
      Done
      <Ionicons name="checkmark-done-circle" size={24} color="green" />
    </>
  ) : (
    <>
      Delete
      <MaterialIcons name="delete-sweep" size={24} color="red" />
    </>
  );

const TaskForm = () => {
  const {
    isViewModeInProgress,
    activeTaskData,
    activeTask,
    handleRemoveTask: onRemoveTask,
    createNewNotification,
    handleMoveTaskBack,
  } = useStateContext();

  const [selectedDate, setSelectedDate] = useState<Date>(
    activeTaskData?.triggerDate!
  );
  const [isDateSelected, setDateSelected] = useState(false);

  const handleDateSelection = useCallback((date: Date) => {
    setDateSelected(true);
    setSelectedDate(date);
  }, []);

  const handleRemoveTask = () => onRemoveTask(String(activeTask));
  const handleCreateNewNotification = () =>
    createNewNotification(selectedDate, activeTaskData);

  return (
    <>
      <DateDisplay date={activeTaskData?.triggerDate!} />

      <View style={styles.controlsContainer}>
        <Pressable
          style={[
            styles.button,
            styles.actionButton,
            isViewModeInProgress ? styles.doneButton : styles.deleteButton,
          ]}
          onPress={handleRemoveTask}
        >
          <Text style={styles.actionText}>
            {removeButtonDescription(isViewModeInProgress)}
          </Text>
        </Pressable>

        {isDateSelected && (
          <TouchableOpacity disabled={!isDateSelected}>
            <Pressable
              style={[
                styles.button,
                styles.actionButton,
                !isDateSelected && styles.buttonDisabled,
              ]}
              disabled={
                !isDateSelected || selectedDate === activeTaskData?.triggerDate
              }
              onPress={handleCreateNewNotification}
            >
              <Text style={styles.actionText}>
                Set new date
                <Entypo
                  name="back-in-time"
                  size={24}
                  color="rgb(165, 166, 167)"
                />
              </Text>
            </Pressable>
          </TouchableOpacity>
        )}

        {!isViewModeInProgress && (
          <Pressable
            style={[
              styles.button,
              styles.actionButton,
              !isDateSelected && styles.buttonDisabled,
            ]}
            disabled={!isDateSelected}
            onPress={handleMoveTaskBack}
          >
            <Text style={styles.actionText}>
              Unfinished task
              <MaterialCommunityIcons
                name="progress-check"
                size={24}
                color="rgb(165, 166, 167)"
              />
            </Text>
          </Pressable>
        )}

        {isViewModeInProgress && (
          <DatePicker
            setSelectedDate={handleDateSelection}
            date={selectedDate ?? new Date()}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 0.2,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionButton: {
    borderWidth: 1,
  },
  doneButton: {
    borderColor: "green",
  },
  deleteButton: {
    borderColor: "red",
  },
  actionText: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    color: "rgb(165, 166, 167)",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TaskForm;
