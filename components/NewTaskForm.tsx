import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
} from "react-native";

interface INewTaskFormProps {
  addNewTask: (text: string) => void;
}

const IOS_TYPE = "ios";

const NewTaskForm = ({ addNewTask }: INewTaskFormProps): JSX.Element => {
  const [newTaskText, setNewTaskText] = useState("");

  const handleCreateNewTask = () => {
    Keyboard.dismiss();
    addNewTask(newTaskText);
    setNewTaskText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === IOS_TYPE ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <TextInput
        style={styles.input}
        placeholder="Write a task"
        onChangeText={setNewTaskText}
        value={newTaskText}
      />

      <TouchableOpacity onPress={handleCreateNewTask} disabled={!newTaskText}>
        <View style={styles.addWrapper}>
          <Text style={styles.addText}>+</Text>
        </View>
      </TouchableOpacity>
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
    width: 250,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  addWrapper: {
    height: 60,
    width: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c0c0c0",
    borderWidth: 1,
  },
  addText: {},
});

export default NewTaskForm;
