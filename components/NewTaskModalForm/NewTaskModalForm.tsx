import { FC, useState, useCallback } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  Pressable,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "@rneui/base";
import { Feather } from "@expo/vector-icons";

import { INewTaskModalFormProps } from "../../models";
import { DEFAULT_COLORS, getColorItem } from "../../utils/getColorItem";
import DatePicker from "../DatePicker";
import {
  cancelScheduledNotification,
  schedulePushNotification,
} from "../../utils/notifications";
import { ColorPicker } from "../ColorPicker";
import { ScheduleSelection } from "../ScheduleSelection";

//we need to extract all useState into one hook - like useForm
const NewTaskModalForm: FC<INewTaskModalFormProps> = ({
  onAdd,
  task,
  onClose,
}) => {
  const [newTaskText, setNewTaskText] = useState(task?.description ?? "");
  const [newTaskTitle, setNewTaskTitle] = useState(task?.title ?? "");
  const [isRepeatableTask, setRepeatableTask] = useState(
    task?.isRepeatable ?? false
  );

  const [triggerDate, setTriggerDate] = useState<Date | null>(
    task?.triggerDate ?? null
  );

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    getColorItem(task?.taskColor)
  );

  const handleChangeColor = (newColor: string) => {
    setSelectedColor(newColor === selectedColor ? "" : newColor);
  };

  const isTaskEditMode = Boolean(
    task && task?.description && task?.title && task?.triggerDate
  );

  const handleDateSelection = useCallback((date: Date) => {
    setTriggerDate(date);
  }, []);

  const handleCreateNewTask = async () => {
    Keyboard.dismiss();

    if (triggerDate) {
      const changedTaskData = {
        ...task,
        description: newTaskText,
        title: newTaskTitle,
        isRepeatable: isRepeatableTask,
        taskColor: selectedColor ? selectedColor : undefined,
      };

      //if we edit task, and income task date diff with state trigger date, which means user change it - we need to delete notification subscription
      if (
        task &&
        isTaskEditMode &&
        task.triggerDate !== triggerDate &&
        task.taskIdentificatorId
      ) {
        changedTaskData.createdAt = new Date();
        changedTaskData.triggerDate = triggerDate;
        await cancelScheduledNotification(task.taskIdentificatorId!);

        const { notificationId } = await schedulePushNotification({
          title: task.title!,
          date: triggerDate,
          text: task.description!,
        });

        if (notificationId) {
          changedTaskData.taskIdentificatorId = notificationId;
        } else {
          changedTaskData.taskIdentificatorId = undefined;
        }
      } else if (!isTaskEditMode) {
        changedTaskData.triggerDate = triggerDate;
        changedTaskData.createdAt = new Date();
      } else {
        changedTaskData.triggerDate = task?.triggerDate;
      }

      onAdd(changedTaskData);

      setNewTaskText("");
      setNewTaskTitle("");
      setRepeatableTask(false);
      setSelectedColor(undefined);
    }
  };

  const toggleCheckbox = () => {
    setRepeatableTask((state) => !state);
  };

  const isTaskEmpty = !Boolean(newTaskTitle && newTaskText && triggerDate);

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.title}>
        {isTaskEditMode ? "Edit" : "Create"} task:
      </Text>

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

      <ColorPicker
        selectedColor={selectedColor}
        onSelectColor={handleChangeColor}
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
          uncheckedIcon={<Feather name="circle" size={24} color="#293238" />}
          title="Is this task repeatable?"
          containerStyle={styles.checkbox}
          textStyle={styles.checkBoxTitle}
        />

        {!isRepeatableTask && (
          <DatePicker
            date={triggerDate ?? new Date()}
            setSelectedDate={handleDateSelection}
          />
        )}
      </View>

      {isRepeatableTask && (
        <View>
          <ScheduleSelection
            onSelectSchedule={() => undefined}
            selectedScheduleType={{}}
          />
        </View>
      )}

      <View style={styles.controlsContainer}>
        <Pressable
          onPress={onClose}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.newTaskText}>Отмена</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            isTaskEmpty && styles.buttonDisabled,
            styles.confirmButton,
          ]}
          disabled={isTaskEmpty}
          onPress={handleCreateNewTask}
        >
          <Text style={styles.newTaskText}>
            {task ? "Сохранить" : "Добавить"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  checkBoxTitle: {
    color: "rgb(165, 166, 167)",
    fontSize: 18,
    fontWeight: "600",
  },
  controlsContainer: {
    flex: 1,
    gap: 12,
    flexDirection: "row",
    marginTop: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ACAEAE",
    textAlign: "center",
  },
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
  },
  checkbox: {
    backgroundColor: "transparent",
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  button: {
    marginTop: "auto",
    borderRadius: 9,
    padding: 10,
    height: 43,
    width: "48%",
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#293238",
  },
  confirmButton: {
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
    backgroundColor: "#293238",
    border: "unset",
    borderRadius: 5,
    color: "#ACAEAE",
    height: 51,
  },
  titleInput: {
    marginBottom: 0,
  },
});

export default NewTaskModalForm;
