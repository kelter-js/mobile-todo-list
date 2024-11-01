import { FC, useMemo } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";

import { getPercentage } from "../../utils/getPercentage";
import { ITaskListProps } from "../../models";
import Task from "../Task/Task";

const windowHeight = Dimensions.get("window").height;

const TaskList: FC<ITaskListProps> = ({
  tasks,
  onTaskOpen,
  onTaskConfigure,
  isViewModeInProgress,
  onTaskDelete,
}) => {
  const renderList = useMemo(() => {
    return tasks.map((task) => {
      const taskId = task.id ? task.id.toString() : "";

      return (
        <Task
          id={taskId}
          key={taskId}
          onOpen={onTaskOpen}
          onConfigure={onTaskConfigure}
          isNotConfigurable={isViewModeInProgress}
          onDelete={onTaskDelete}
          {...task}
        />
      );
    });
  }, [tasks, onTaskOpen, onTaskConfigure, isViewModeInProgress]);

  return (
    <View style={styles.listContainer}>
      <ScrollView style={styles.items}>{renderList}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: getPercentage(79, windowHeight),
  },
  items: {
    marginTop: 10,
    paddingRight: 4,
  },
});

export default TaskList;
