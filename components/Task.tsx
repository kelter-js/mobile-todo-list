import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";

export interface ITask {
  text: string;
  id: string | Uint8Array;
}

interface ITaskProps extends ITask {
  onOpen: (id: string) => void;
  id: string | Uint8Array;
}

const Task = ({ text, id, onOpen }: ITaskProps): JSX.Element => {
  
  const handleOpening = () => {
    onOpen(String(id));
  }

  return (
    <TouchableOpacity onPress={handleOpening}>
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={styles.square}></View>
          <Text style={styles.itemText}>{text}</Text>
        </View>
        <Pressable style={styles.circular} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  itemText: {
    maxWidth: "80%",
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
