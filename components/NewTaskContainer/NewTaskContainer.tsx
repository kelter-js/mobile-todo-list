import { FC, useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { INewTaskFormProps, ITask } from "../../view";
import ModalWindow from "../Modal";
import NewTaskModalForm from "../NewTaskModalForm";

const IOS_TYPE = "ios";

const NewTaskForm: FC<INewTaskFormProps> = ({ onAdd }) => {
  const [isTaskFormOpened, setTaskFormOpened] = useState(false);

  const isPlatformIOS = Platform.OS === IOS_TYPE;

  const toggleTaskForm = useCallback(() => {
    setTaskFormOpened((state) => !state);
  }, []);

  const handleTaskCreation = useCallback((data: Omit<ITask, "id">) => {
    onAdd(data);
    setTaskFormOpened(false);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={isPlatformIOS ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <ModalWindow
        onCloseModal={toggleTaskForm}
        isWindowOpened={isTaskFormOpened}
      >
        <NewTaskModalForm onAdd={handleTaskCreation} />
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
    backgroundColor: "rgb(251, 238, 224)",
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
