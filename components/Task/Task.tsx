import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getShortReviewDate } from "../../utils/getShortReviewDate";
import { DEFAULT_COLOR } from "../../utils/getColorItem";
import { TaskDataProps } from "../../models";
import { getPercentageDiffBetweenDates } from "../../utils/getPercentageDiffBetweenDates";
import { getReadableDateDiff } from "../../utils/getReadableDateDiff";
import { useStateContext } from "../../context/StateContext";

const Task: FC<TaskDataProps> = ({
  description,
  title,
  isRepeatable,
  id,
  taskColor,
  triggerDate,
  createdAt,
  isLastTask,
}) => {
  const {
    handleTaskOpen,
    handleTaskConfigure,
    handleDeleteTask,
    isViewModeInProgress,
  } = useStateContext();

  const handleOpening = () => handleTaskOpen(String(id));

  const handleConfigure = () => handleTaskConfigure(String(id));

  const handleDeletion = () => handleDeleteTask(String(id));

  const completePercentage = getPercentageDiffBetweenDates(
    createdAt ?? new Date(),
    triggerDate ?? new Date()
  );

  return (
    <TouchableOpacity onPress={handleOpening}>
      <View
        style={[
          styles.item,
          {
            marginBottom: isLastTask ? 0 : 20,
            backgroundColor: "rgba(61, 74, 82, 0.3)",
          },
        ]}
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
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color="rgb(165, 166, 167)"
            />
          </TouchableOpacity>

          {isViewModeInProgress && (
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
                  color="rgb(165, 166, 167)"
                />
              </TouchableOpacity>
            </View>
          )}

          {isRepeatable ? (
            <MaterialCommunityIcons
              name="repeat"
              size={24}
              color="rgb(165, 166, 167)"
            />
          ) : (
            <MaterialCommunityIcons
              name="repeat-off"
              size={24}
              color="rgb(165, 166, 167)"
            />
          )}
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.mark}>Метка: </Text>
          <View
            style={[
              styles.label,
              {
                //определяем выбранный прежде цвет, переделать на label: и элемент с бэкграундом цвета, 20 на 20 px
                backgroundColor: taskColor ?? DEFAULT_COLOR,
              },
            ]}
          />
        </View>

        {isViewModeInProgress && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTitleContainer}>
              <Text style={styles.progressBarTitle}>Прогресс:</Text>
              <Text style={styles.progressBarPercentage}>
                {completePercentage}%
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFiller,
                  { width: `${completePercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.daysLeftDescription}>
              {getReadableDateDiff(
                createdAt ?? new Date(),
                triggerDate ?? new Date()
              )}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  daysLeftDescription: {
    fontWeight: "600",
    fontSize: 12,
    color: "rgb(165, 166, 167)",
  },
  progressBarPercentage: {
    fontWeight: "600",
    fontSize: 16,
    color: "rgb(165, 166, 167)",
  },
  progressBarTitle: { fontWeight: "600", fontSize: 16, color: "#949697" },
  progressBarTitleContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  progressBarContainer: { width: "100%", marginTop: 8 },
  label: { height: 20, width: 40, marginLeft: 8, marginTop: 2 },
  labelContainer: {
    minWidth: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
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
    fontWeight: "600",
    color: "rgb(165, 166, 167)",
  },
  configureControls: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taskDescription: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
    width: 219,
    color: "rgb(165, 166, 167)",
  },
  mark: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
    flexGrow: 0,
    color: "rgb(165, 166, 167)",
  },
  item: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    border: "2px solid #293238",
    borderRadius: 9,
    color: "#422800",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

export default Task;
