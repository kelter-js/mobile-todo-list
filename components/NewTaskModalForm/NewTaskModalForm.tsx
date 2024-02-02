import { FC, useState } from "react";
import { TextInput, View, StyleSheet, Keyboard } from "react-native";

import { INewTaskFormProps } from "../../view";

//в модальном окне инпут для текста задачи и чекбокс для того чтобы отметить, задача повторяемая или нет
//в новом модальном окне расписать всё более полно - есть тайтл и будет дескрипшн у каждой задачи
//checkbox
//title
//description
const NewTaskModalForm: FC<INewTaskFormProps> = ({ addNewTask }) => {
  const [newTaskText, setNewTaskText] = useState("");

  const handleCreateNewTask = () => {
    Keyboard.dismiss();
    addNewTask(newTaskText);
    setNewTaskText("");
  };

  const isTaskReadyToAdd = !newTaskText;

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Write a task"
        onChangeText={setNewTaskText}
        value={newTaskText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    flexGrow: 1,
  },
});

export default NewTaskModalForm;
