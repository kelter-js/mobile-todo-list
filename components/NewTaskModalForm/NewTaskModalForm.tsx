import { FC, useState } from "react";
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

import { INewTaskFormProps } from "../../view";

//в модальном окне инпут для текста задачи и чекбокс для того чтобы отметить, задача повторяемая или нет
//в новом модальном окне расписать всё более полно - есть тайтл и будет дескрипшн у каждой задачи
//checkbox
//title
//description
const NewTaskModalForm: FC<INewTaskFormProps> = ({ addNewTask }) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isRepeatableTask, setRepeatableTask] = useState(false);
  console.log("newTaskText", newTaskText);

  const handleCreateNewTask = () => {
    Keyboard.dismiss();
    addNewTask(newTaskText);
    setNewTaskText("");
    setNewTaskTitle("");
  };
  const toggleCheckbox = () => {
    setRepeatableTask((state) => !state);
  };

  const isTaskEmpty = !newTaskText;

  return (
    <View style={styles.taskContainer}>
      <TextInput
        style={styles.input}
        placeholder="Task title"
        onChangeText={setNewTaskText}
        value={newTaskText}
      />

      <TextInput
        style={styles.input}
        placeholder="Task description"
        onChangeText={setNewTaskTitle}
        value={newTaskTitle}
      />

      <View>
        <CheckBox
          checked={isRepeatableTask}
          onPress={toggleCheckbox}
          size={30}
          checkedIcon={<Feather name="check-circle" size={24} color="green" />}
          uncheckedIcon={<Feather name="circle" size={24} color="black" />}
          title="Is this task repeatable?"
        />
      </View>

      <Pressable
        style={[styles.button, isTaskEmpty && styles.buttonDisabled]}
        disabled={isTaskEmpty}
      >
        <Text style={styles.newTaskText}>Create new task</Text>
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
});

export default NewTaskModalForm;
