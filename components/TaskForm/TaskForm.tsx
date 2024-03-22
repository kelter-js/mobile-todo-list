import { Pressable, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FC, useCallback, useState } from "react";

import { TaskFormProps } from "../../view";
import DatePicker from "../DatePicker";

const removeButtonDescription = (isViewModeInProgress: boolean) =>
  isViewModeInProgress ? "Mark as done" : "Delete";

//place buttons near bottom of modal
//replace delete button with trash icon
//replace mark as done/mark as unfinished with icons(think about it)
//create accent on which date to remind is settled
//create edit view mode, like pencil icon, user click - we close this modal
const TaskForm: FC<TaskFormProps> = ({
  onRemoveTask,
  onMoveTaskBack,
  onCreateReminder,
  taskId,
  isViewModeInProgress,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDateSelected, setDateSelected] = useState(false);

  const handleDateSelection = useCallback((date: Date) => {
    setDateSelected(true);
    setSelectedDate(date);
  }, []);

  return (
    <>
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={onRemoveTask}
      >
        <Text style={styles.textStyle}>
          {removeButtonDescription(isViewModeInProgress)}
        </Text>
      </Pressable>

      {!isViewModeInProgress && (
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={onMoveTaskBack}
        >
          <Text style={styles.textStyle}>Mark as unfinished task</Text>
        </Pressable>
      )}

      {isViewModeInProgress && (
        <TouchableOpacity disabled={!isDateSelected}>
          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              !isDateSelected && styles.buttonDisabled,
            ]}
            disabled={!isDateSelected}
            onPress={() => onCreateReminder(selectedDate)}
          >
            <Text style={styles.textStyle}>
              Remind me about this task later
            </Text>
          </Pressable>
        </TouchableOpacity>
      )}

      {isViewModeInProgress && (
        <DatePicker setSelectedDate={handleDateSelection} date={selectedDate} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.3,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TaskForm;
