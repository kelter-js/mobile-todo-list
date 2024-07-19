import { FC } from "react";
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
}) => (
  <View style={styles.listContainer}>
    <ScrollView style={styles.items}>
      {tasks.map(({ id, description, title, isRepeatable }, index) => (
        <Task
          id={id ? id.toString() : ""}
          description={description}
          title={title}
          isRepeatable={isRepeatable}
          key={id?.toString() ?? index}
          onOpen={onTaskOpen}
          onConfigure={onTaskConfigure}
          isNotConfigurable={isViewModeInProgress}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  listContainer: {
    height: getPercentage(78, windowHeight),
    paddingTop: 10,
  },
  items: {
    marginTop: 10,
    paddingRight: 4,
  },
});

export default TaskList;
