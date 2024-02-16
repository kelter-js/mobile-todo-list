import { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { ITaskProps } from "../../view";

const Task: FC<ITaskProps> = ({
  description,
  title,
  isRepeatable,
  id,
  onOpen,
}) => {
  const handleOpening = () => {
    onOpen(String(id));
  };

  return (
    <TouchableOpacity onPress={handleOpening}>
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={styles.square}></View>
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{title}</Text>
            <Text style={styles.taskDescription}>{description}</Text>
          </View>
        </View>
        <Pressable style={styles.circular} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flex: 1,
    width: "100%",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  taskDescription: { fontSize: 16, fontWeight: "400" },
  item: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#fbeee0",
    border: "2px solid #422800",
    borderRadius: 30,
    boxShadow: "#422800 4px 4px 0 0",
    color: "#422800",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    height: 24,
    width: 24,
    backgroundColor: "#55BCF6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  circular: {
    height: 24,
    width: 24,
    borderColor: "#55BCF6",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
