import {
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useStateContext } from "../../context/StateContext";
import { isPlatformIOS } from "./constants";

const NewTaskForm = () => {
  const { isViewModeInProgress, clearDoneTasks, toggleTaskForm, tasksToView } =
    useStateContext();

  const isDisabled = !isViewModeInProgress && tasksToView?.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={isPlatformIOS ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <Pressable
        onPress={isViewModeInProgress ? toggleTaskForm : clearDoneTasks}
        style={[styles.addWrapper, isDisabled && styles.diabled]}
      >
        <Text
          style={[isViewModeInProgress ? styles.addText : styles.removeText]}
        >
          {isViewModeInProgress ? "+" : "Clear"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  writeTaskWrapper: {
    flex: 1,
    position: "absolute",
    bottom: 25,
    left: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
  addWrapper: {
    position: "relative",
    minHeight: 60,
    minWidth: 60,
    width: "auto",
    backgroundColor: "#1e93e0",
    borderRadius: 12,
    marginLeft: "auto",
    marginRight: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  diabled: {
    opacity: 0.3,
  },
  addText: {
    position: "absolute",
    top: "-15%",
    left: "25%",
    fontSize: 50,
    color: "white",
  },
  removeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default NewTaskForm;
