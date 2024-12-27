import { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { INewTaskFormProps } from "../../models";

const IOS_TYPE = "ios";
const isPlatformIOS = Platform.OS === IOS_TYPE;

const NewTaskForm: FC<INewTaskFormProps> = ({
  onClear,
  isViewModeInProgress,
  toggleTaskForm,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={isPlatformIOS ? "padding" : "height"}
      style={styles.writeTaskWrapper}
    >
      <Pressable
        onPress={isViewModeInProgress ? toggleTaskForm : onClear}
        style={[
          styles.addWrapper,
          !isViewModeInProgress && styles.removeContainer,
        ]}
      >
        <Text
          style={[isViewModeInProgress ? styles.addText : styles.removeText]}
        >
          {isViewModeInProgress ? "+" : "Clear list"}
        </Text>
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
    minHeight: 60,
    minWidth: 60,
    width: "auto",
    backgroundColor: "rgb(251, 238, 224)",
    borderRadius: 60,
    marginLeft: "auto",
    marginRight: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c0c0c0",
    borderWidth: 1,
  },
  removeContainer: {
    width: 150,
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
  removeText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default NewTaskForm;
