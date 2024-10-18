import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getShortReviewDate } from "../../utils/getShortReviewDate";
import { DEFAULT_COLOR } from "../../utils/getColorItem";
import { ITaskProps } from "../../models";
import { getPercentageDiffBetweenDates } from "../../utils/getPercentageDiffBetweenDates";

const Task: FC<ITaskProps> = ({
  description,
  title,
  isRepeatable,
  id,
  taskColor,
  onOpen,
  onConfigure,
  isNotConfigurable,
  triggerDate,
  onDelete,
  createdAt,
}) => {
  const handleOpening = () => {
    onOpen(String(id));
  };

  const handleConfigure = () => {
    onConfigure(String(id));
  };

  const handleDeletion = () => {
    onDelete(String(id));
  };

  const completePercentage = getPercentageDiffBetweenDates(
    createdAt ?? new Date(),
    triggerDate ?? new Date()
  );

  return (
    <TouchableOpacity onPress={handleOpening}>
      <View
        style={[styles.item, { backgroundColor: taskColor ?? DEFAULT_COLOR }]}
      >
        <View style={styles.itemLeft}>
          <View style={styles.taskContainer}>
            <Text
              style={styles.taskTitle}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {title}
            </Text>
            <Text
              style={styles.taskDescription}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {description}
            </Text>
            {triggerDate && (
              <Text style={styles.taskDescription}>
                {getShortReviewDate(triggerDate)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handleDeletion}
            style={{ marginBottom: 2 }}
          >
            <MaterialCommunityIcons name="delete" size={24} color="black" />
          </TouchableOpacity>

          {isNotConfigurable && (
            <View
              style={styles.configureControls}
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
                />
              </TouchableOpacity>
            </View>
          )}

          {isRepeatable ? (
            <MaterialCommunityIcons name="repeat" size={24} color="black" />
          ) : (
            <MaterialCommunityIcons name="repeat-off" size={24} color="black" />
          )}
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFiller,
              { width: `${completePercentage}%` },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#3d4a52",
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  progressBarFiller: {
    height: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  taskContainer: {
    flex: 1,
    width: "100%",
  },
  taskTitle: {
    flex: 1,
    width: 219,
    fontSize: 18,
    fontWeight: "700",
  },
  configureControls: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  taskDescription: { fontSize: 16, fontWeight: "400", flex: 1, width: 219 },
  item: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
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

  circular: {
    height: 24,
    width: 24,
    borderColor: "#55BCF6",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
