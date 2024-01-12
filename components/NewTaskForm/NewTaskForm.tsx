import { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { INewTaskFormProps } from "../../view";

const IOS_TYPE = "ios";

//todo: просто оставляем кнопку с + большую, когда нажимаем - модальное окно
//в модальном окне инпут для текста задачи и чекбокс для того чтобы отметить, задача повторяемая или нет
//по нажатию закрываем модалку
const NewTaskForm: FC<INewTaskFormProps> = ({ addNewTask }) => {
  const [newTaskText, setNewTaskText] = useState("");

  const handleCreateNewTask = () => {
    Keyboard.dismiss();
    addNewTask(newTaskText);
    setNewTaskText("");
  };

  const isPlatformIOS = Platform.OS === IOS_TYPE;
  const isTaskReadyToAdd = !newTaskText;

  return (
    <KeyboardAvoidingView
      behavior={isPlatformIOS ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <TextInput
        style={styles.input}
        placeholder="Write a task"
        onChangeText={setNewTaskText}
        value={newTaskText}
      />

      <TouchableWithoutFeedback
        onPress={handleCreateNewTask}
        disabled={isTaskReadyToAdd}
      >
        <View
          style={[
            styles.addWrapper,
            isTaskReadyToAdd && styles.addWrapperDisabled,
          ]}
        >
          <Text style={styles.addText}>+</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  writeTaskWrapper: {
    flex: 1,
    position: "absolute",
    bottom: 60,
    left: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 60,
  },
  addWrapper: {
    position: "relative",
    height: 60,
    width: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c0c0c0",
    borderWidth: 1,
  },
  addWrapperDisabled: {
    opacity: 0.3,
  },
  addText: {
    position: "absolute",
    top: "-15%",
    left: "25%",
    fontSize: 50,
  },
});

export default NewTaskForm;
