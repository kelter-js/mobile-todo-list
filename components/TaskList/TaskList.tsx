import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { FC } from "react";

import { ITaskListProps } from "../../view";
import Task from "../Task/Task";

import { getPercentage } from "../../utils/getPercentage";

const windowHeight = Dimensions.get("window").height;

const TaskList: FC<ITaskListProps> = ({ tasks, onTaskOpen }) => (
  <View style={styles.listContainer}>
    <ScrollView style={styles.items}>
      {tasks.map(({ id, description, title, isRepeatable }, index) => (
        <Task
          id={id.toString()}
          description={description}
          title={title}
          isRepeatable={isRepeatable}
          key={id.toString()}
          onOpen={onTaskOpen}
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
