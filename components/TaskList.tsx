import Task, { ITask } from "./Task";
import { View, StyleSheet, ScrollView } from "react-native";

interface ITaskListProps {
  tasks: Array<ITask>;
  onTaskOpen: (id: string) => void;
}

const TaskList = ({ tasks, onTaskOpen }: ITaskListProps): JSX.Element => {
  return (
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
};

const styles = StyleSheet.create({
  listContainer: {
    height: 300,
  },
  items: {
    marginTop: 30,
  },
});

export default TaskList;
