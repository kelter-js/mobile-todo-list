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
    return tasks.map((task, index, self) => {
      const taskId = task.id ? task.id.toString() : "";

      return (
        <Task
          id={taskId}
          key={taskId}
          onOpen={onTaskOpen}
          onConfigure={onTaskConfigure}
          isNotConfigurable={isViewModeInProgress}
          onDelete={onTaskDelete}
          isLastTask={index === self.length - 1}
          {...task}
        />
      );
    });
  }, [tasks, onTaskOpen, onTaskConfigure, isViewModeInProgress]);

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
