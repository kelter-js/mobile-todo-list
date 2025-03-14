import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";

//components
import TaskFilterButtons from "../TaskFilterButtons";
import NewTaskModalForm from "../NewTaskModalForm";
import NewTaskContainer from "../NewTaskContainer";
import SplashScreen from "../../view/SplashScreen";
import TaskList from "../TaskList";
import ModalWindow from "../Modal";
import TaskForm from "../TaskForm";

import { ConfirmDeletion } from "../ConfirmDeletion";
import { EditView } from "../../view/EditView";
import { useStateContext } from "../../context/StateContext";
import { DELETION_MODAL_HEIGHT, prefabImage } from "./constants";

const windowHeight = Dimensions.get("window").height;

const Main = (): JSX.Element => {
  const {
    isLoadingTasks,
    isTaskFormOpened,
    isModalWindowOpened,
    isTaskEditMode,
    handleCloseTaskModal,
    activeTaskData,
    deleteTask,
    handleCloseDeletionModal,
  } = useStateContext();

  if (!isLoadingTasks) {
    return <SplashScreen />;
  }

  if (isTaskFormOpened) {
    return (
      <EditView>
        <NewTaskModalForm />
      </EditView>
    );
  }

  if (isModalWindowOpened && isTaskEditMode) {
    return (
      <EditView>
        <NewTaskModalForm task={activeTaskData} />
      </EditView>
    );
  }

  return (
    <View style={styles.appContainer}>
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={prefabImage}
      />

      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Задачи</Text>

        <TaskFilterButtons />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TaskList />
        </ScrollView>

        <ModalWindow
          onCloseModal={handleCloseTaskModal}
          isWindowOpened={isModalWindowOpened && !isTaskEditMode && !deleteTask}
        >
          <TaskForm />
        </ModalWindow>

        <ModalWindow
          onCloseModal={handleCloseDeletionModal}
          isWindowOpened={Boolean(isModalWindowOpened && deleteTask)}
          height={DELETION_MODAL_HEIGHT}
        >
          <ConfirmDeletion />
        </ModalWindow>
      </View>

      <NewTaskContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    height: windowHeight,
  },
  appContainer: {
    flex: 1,
    height: windowHeight,
    maxHeight: windowHeight,
    overflow: "hidden",
  },
  tasksContainer: {
    marginTop: 15,
    marginHorizontal: 10,
    height: "100%",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b6b7b8",
    textAlign: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Main;
