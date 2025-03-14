import { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import Task from "../Task/Task";
import { useStateContext } from "../../context/StateContext";

const TaskList = () => {
  const {
    isViewModeInProgress,
    handleTaskOpen,
    tasksToView,
    handleTaskConfigure,
  } = useStateContext();

  const renderList = useMemo(
    () =>
      tasksToView?.map((task, index, self) => {
        const taskId = task.id ? task.id.toString() : "";

        return (
          <Task
            id={taskId}
            key={taskId}
            isLastTask={index === self.length - 1}
            {...task}
          />
        );
      }),
    [tasksToView, handleTaskOpen, handleTaskConfigure, isViewModeInProgress]
  );

  return (
    <View style={styles.listContainer}>
      <ScrollView style={styles.items}>
        {renderList}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: "100%",
  },
  items: {
    marginTop: 10,
    paddingRight: 4,
  },
});

export default TaskList;
