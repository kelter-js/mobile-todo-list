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

import { getColorItem } from "../../utils/getColorItem";
import DatePicker from "../DatePicker";
import {
  cancelScheduledNotification,
  schedulePushNotification,
} from "../../utils/notifications";
import { ColorPicker } from "../ColorPicker";
import { ScheduleSelection } from "../ScheduleSelection";

import {
  MIN_SCHEDULE_INTERVAL,
  SCHEDULE_TYPES,
} from "../ScheduleSelection/constants";
import { useStateContext } from "../../context/StateContext";
import { NewTaskModalFormProps } from "./types";

//we need to extract all useState into one hook - like useForm
const NewTaskModalForm: FC<NewTaskModalFormProps> = ({ task }) => {
  const { handleCloseTaskModal, handleTaskCreation } = useStateContext();

  const [newTaskText, setNewTaskText] = useState(task?.description ?? "");
  const [newTaskTitle, setNewTaskTitle] = useState(task?.title ?? "");
  const [isRepeatableTask, setRepeatableTask] = useState(
    task?.isRepeatable ?? false
  );
  const [isAutoPlanning, setIsAutoPlanning] = useState(
    task?.isAutoPlanning ?? false
  );

  const [triggerDate, setTriggerDate] = useState<Date | null>(
    task?.triggerDate ?? new Date()
  );

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    getColorItem(task?.taskColor)
  );

  const [scheduleType, setScheduleType] = useState<SCHEDULE_TYPES>(
    SCHEDULE_TYPES.MINUTES
  );
  const [scheduleFrequency, setScheduleFrequency] = useState(
    MIN_SCHEDULE_INTERVAL[SCHEDULE_TYPES.MINUTES]
  );

  const handleChangeScheduleType = (newType: SCHEDULE_TYPES) => {
    setScheduleType(newType);
    setScheduleFrequency(MIN_SCHEDULE_INTERVAL[newType]);
  };

  const handleChangeScheduleFrequency = (newFrenquency: number) => {
    setScheduleFrequency(newFrenquency);
  };

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
        repeatType: scheduleType,
        repeatFrequency: scheduleFrequency,
      };

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

      handleTaskCreation(changedTaskData);

      setNewTaskText("");
      setNewTaskTitle("");
      setRepeatableTask(false);
      setSelectedColor(undefined);
    }
  };

  const toggleCheckbox = () => {
    setRepeatableTask((state) => !state);
    setIsAutoPlanning(false);
  };
  const toggleAutoPlanning = () => {
    setIsAutoPlanning((state) => !state);
    setRepeatableTask(false);
  };

  const isTaskEmpty = !Boolean(newTaskTitle && newTaskText && triggerDate);

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.title}>
        {isTaskEditMode ? "Edit" : "Create"} task:
      </Text>

      <TextInput
        style={[styles.input, styles.titleInput]}
        placeholder="Task title"
        onChangeText={setNewTaskText}
        value={newTaskText}
        multiline={true}
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Task description"
        onChangeText={setNewTaskTitle}
        value={newTaskTitle}
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

        {!isAutoPlanning && (
          <DatePicker
            date={triggerDate ?? new Date()}
            setSelectedDate={handleDateSelection}
          />
        )}
      </View>

      <View
        style={[
          styles.mainContainer,
          !isTaskEditMode && styles.datePickerContainer,
        ]}
      >
        <CheckBox
          checked={isAutoPlanning}
          onPress={toggleAutoPlanning}
          size={30}
          checkedIcon={<Feather name="check-circle" size={24} color="green" />}
          uncheckedIcon={<Feather name="circle" size={24} color="#293238" />}
          title="Is this task should be auto planned?"
          containerStyle={styles.checkbox}
          textStyle={styles.checkBoxTitle}
        />
      </View>

      {isAutoPlanning && (
        <View>
          <ScheduleSelection
            onSelectSchedule={handleChangeScheduleType}
            selectedScheduleType={scheduleType}
            selectedScheduleFrequency={scheduleFrequency}
            onSelectFrequency={handleChangeScheduleFrequency}
          />
        </View>
      )}

      <View style={styles.controlsContainer}>
        <Pressable
          onPress={handleCloseTaskModal}
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
    paddingTop: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ACAEAE",
    textAlign: "center",
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    flexGrow: 0,
    height: 46,
    minHeight: 46,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 8,
    marginBottom: 12,
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
  taskContainer: {
    flex: 1,
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
  descriptionInput: {
    height: 136,
    textAlignVertical: "top",
  },
});

export default NewTaskModalForm;
