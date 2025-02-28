import {
  Pressable,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { FC, useCallback, useState } from "react";

import { TaskFormProps } from "../../models";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "../DatePicker";
import DateDisplay from "../DateDisplay";

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

const TaskForm: FC<TaskFormProps> = ({
  onRemoveTask,
  onMoveTaskBack,
  onCreateReminder,
  taskId,
  isViewModeInProgress,
  task,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(task?.triggerDate!);
  const [isDateSelected, setDateSelected] = useState(false);

  const handleDateSelection = useCallback((date: Date) => {
    setDateSelected(true);
    setSelectedDate(date);
  }, []);

  const handleRemoveTask = () => {
    onRemoveTask(taskId);
  };

  return (
    <>
      <DateDisplay date={task?.triggerDate!} />

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
              disabled={!isDateSelected || selectedDate === task?.triggerDate}
              onPress={() => onCreateReminder(selectedDate, task)}
            >
              <Text style={styles.actionText}>
                Set new date
                <Entypo name="back-in-time" size={24} color="black" />
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
            onPress={onMoveTaskBack}
          >
            <Text style={styles.actionText}>
              Unfinished task
              <MaterialCommunityIcons
                name="progress-check"
                size={24}
                color="black"
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
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  button: {
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
  },
  doneButton: {
    borderColor: "green",
  },
  deleteButton: {
    borderColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  actionText: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TaskForm;
