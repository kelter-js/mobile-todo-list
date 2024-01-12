import { View, StyleSheet, ScrollView } from "react-native";
import { FC } from "react";

import { ITaskListProps } from "../../view";
import Task from "../Task/Task";

const TaskList: FC<ITaskListProps> = ({ tasks, onTaskOpen }) => (
  <View style={styles.listContainer}>
    <ScrollView style={styles.items}>
      {tasks.map((item, index) => (
        <Task
          id={String(item.id)}
          text={item.text}
          key={index}
          onOpen={onTaskOpen}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  listContainer: {
    height: 316,
    paddingTop: 10,
  },
  items: {
    marginTop: 10,
  },
});

export default TaskList;
