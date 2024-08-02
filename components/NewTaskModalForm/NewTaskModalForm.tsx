import { FC, useState, useCallback } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  Pressable,
  Text,
} from "react-native";
import { CheckBox } from "@rneui/base";
import { Feather } from "@expo/vector-icons";

import { INewTaskModalFormProps } from "../../models";
import DatePicker from "../DatePicker";

const NewTaskModalForm: FC<INewTaskModalFormProps> = ({ onAdd, task = {} }) => {
  const [newTaskText, setNewTaskText] = useState(task?.description ?? "");
  const [newTaskTitle, setNewTaskTitle] = useState(task?.title ?? "");
  const [isRepeatableTask, setRepeatableTask] = useState(
    task?.isRepeatable ?? false
  );
  const [triggerDate, setTriggerDate] = useState<Date | null>(
    task?.triggerDate ?? null
  );

  const isTaskEditMode = Boolean(
    task?.description && task?.title && task?.triggerDate
  );

  const handleDateSelection = useCallback((date: Date) => {
    setTriggerDate(date);
  }, []);

  const handleCreateNewTask = () => {
    Keyboard.dismiss();

    if (triggerDate) {
      onAdd({
        ...task,
        description: newTaskText,
        title: newTaskTitle,
        isRepeatable: isRepeatableTask,
        triggerDate: isTaskEditMode ? task.triggerDate : triggerDate,
      });

      setNewTaskText("");
      setNewTaskTitle("");
      setRepeatableTask(false);
    }
  };

  const toggleCheckbox = () => {
    setRepeatableTask((state) => !state);
  };

  const isTaskEmpty = !Boolean(newTaskTitle && newTaskText && triggerDate);

  return (
    <View style={styles.taskContainer}>
      <TextInput
        style={styles.input}
        placeholder="Task description"
        onChangeText={setNewTaskTitle}
        value={newTaskTitle}
      />

      <TextInput
        style={[styles.input, styles.titleInput]}
        placeholder="Task title"
        onChangeText={setNewTaskText}
        value={newTaskText}
      />

      <View
        style={[
          styles.mainContainer,
          !isTaskEditMode && styles.datePickerContainer,
        ]}
      >
        <CheckBox
          checked={isRepeatableTask}
          onPress={toggleCheckbox}
          size={30}
          checkedIcon={<Feather name="check-circle" size={24} color="green" />}
          uncheckedIcon={<Feather name="circle" size={24} color="black" />}
          title="Is this task repeatable?"
        />

        {!isTaskEditMode && (
          <DatePicker
            date={triggerDate ?? new Date()}
            setSelectedDate={handleDateSelection}
          />
        )}
      </View>

      <Pressable
        style={[styles.button, isTaskEmpty && styles.buttonDisabled]}
        disabled={isTaskEmpty}
        onPress={handleCreateNewTask}
      >
        <Text style={styles.newTaskText}>
          {task ? "Save changes" : "Create new task"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: -15,
  },
  checkbox: {
    margin: 8,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  paragraph: {
    fontSize: 15,
  },
  taskContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  button: {
    marginTop: "auto",
    borderRadius: 20,
    padding: 10,
    marginBottom: 22,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  newTaskText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
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

export default NewTaskModalForm;
