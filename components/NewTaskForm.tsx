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
  Dimensions,
} from "react-native";

interface INewTaskFormProps {
  addNewTask: (text: string) => void;
}

const IOS_TYPE = "ios";
const screenWidth = Dimensions.get("window").width;

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
    flexGrow: 1,
  },
  writeTaskWrapper: {
    flex: 1,
    position: "absolute",
    bottom: 60,
    left: 10,
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 60,
  },
  addWrapper: {
    position: 'relative',
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
  addText: {
    position: 'absolute',
    top: "-15%",
    left: "25%",
    fontSize: 50,
  },
});

export default NewTaskForm;
