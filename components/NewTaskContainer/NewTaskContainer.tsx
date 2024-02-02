import { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { INewTaskFormProps } from "../../view";
import ModalWindow from "../Modal";
import NewTaskModalForm from "../NewTaskModalForm";

const IOS_TYPE = "ios";

const NewTaskForm: FC<INewTaskFormProps> = ({ addNewTask }) => {
  const [isTaskFormOpened, setTaskFormOpened] = useState(false);

  const isPlatformIOS = Platform.OS === IOS_TYPE;

  const toggleTaskForm = () => {
    setTaskFormOpened((state) => !state);
  };

  return (
    <KeyboardAvoidingView
      behavior={isPlatformIOS ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <ModalWindow
        onCloseModal={toggleTaskForm}
        isWindowOpened={isTaskFormOpened}
      >
        <NewTaskModalForm addNewTask={addNewTask} />
      </ModalWindow>

      <Pressable onPress={toggleTaskForm} style={styles.addWrapper}>
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: "auto",
    marginRight: 25,
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
