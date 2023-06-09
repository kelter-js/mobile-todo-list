import Task from "./Task";
import { View, StyleSheet } from "react-native";

interface ITaskListProps {
  tasks: Array<{ text: string }>;
  onRemove: (id: number) => void;
}

const TaskList = ({ tasks, onRemove }: ITaskListProps): JSX.Element => {
  return (
    <View style={styles.items}>
      {tasks.map((item, index) => (
        <Task index={index} text={item.text} key={index} onRemove={onRemove} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  items: {
    marginTop: 30,
  },
});

export default TaskList;
