import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ITaskProps } from "../../models";

//need to display in same space where we render title and description we need to render date
// if date is today - show time
const Task: FC<ITaskProps> = ({
  description,
  title,
  isRepeatable,
  id,
  onOpen,
  onConfigure,
}) => {
  const handleOpening = () => {
    onOpen(String(id));
  };

  const handleConfigure = () => {
    onConfigure(String(id));
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

        <View style={styles.controlsContainer}>
          <View
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            <TouchableOpacity onPress={handleConfigure}>
              <MaterialCommunityIcons
                name="calendar-edit"
                size={24}
                color="black"
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>

          {isRepeatable ? (
            <MaterialCommunityIcons name="repeat" size={24} color="black" />
          ) : (
            <MaterialCommunityIcons name="repeat-off" size={24} color="black" />
          )}
        </View>
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
  controlsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  calendarIcon: {
    marginRight: 10,
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
