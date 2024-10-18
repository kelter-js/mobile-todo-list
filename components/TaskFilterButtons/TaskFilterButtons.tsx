import { FC } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ViewModes } from "../../enums";
import { SORT_DIRECTIONS } from "../../entities/SortDirections";

interface TaskFilterButtonsProps {
  isViewModeInProgress: boolean;
  setViewMode: (viewMode: keyof typeof ViewModes) => void;
  sortDirection: SORT_DIRECTIONS;
  handleChangeSortDirection: VoidFunction;
  hasSortButton: boolean;
}

const TaskFilterButtons: FC<TaskFilterButtonsProps> = ({
  isViewModeInProgress,
  setViewMode,
  sortDirection,
  handleChangeSortDirection,
  hasSortButton,
}) => {
  const handleSetFinishedViewMode = () => setViewMode(ViewModes.FINISHED);
  const handleSetInProgressViewMode = () => setViewMode(ViewModes.IN_PROGRESS);

  return (
    <View style={styles.container}>
      <View style={styles.sortControlsContainer}>
        <Pressable
          style={[
            styles.sortTasksButton,
            isViewModeInProgress && styles.sortTasksButtonSelected,
          ]}
          onPress={handleSetInProgressViewMode}
        >
          <Text style={styles.sortTasksButtonText}>Future tasks</Text>
        </Pressable>

        <Pressable
          style={[
            styles.sortTasksButton,
            !isViewModeInProgress && styles.sortTasksButtonSelected,
          ]}
          onPress={handleSetFinishedViewMode}
        >
          <Text style={styles.sortTasksButtonText}>Finished tasks</Text>
        </Pressable>
      </View>

      {hasSortButton && (
        <View style={styles.sortByTimeContainer}>
          <Pressable
            style={styles.sortTasksButtonByTime}
            onPress={handleChangeSortDirection}
          >
            <MaterialCommunityIcons
              name={
                sortDirection === SORT_DIRECTIONS.ASC
                  ? "sort-clock-descending"
                  : "sort-clock-ascending"
              }
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 119,
  },
  sortControlsContainer: {
    maxHeight: 45,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  sortByTimeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  sortTasksButtonByTime: {
    width: 50,
    backgroundColor: "#fbeee0",
    border: "2px solid #422800",
    borderRadius: 30,
    color: "#422800",
    fontWeight: "400",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    lineHeight: 50,
    transform: [{ scale: 0.9 }],
  },
  sortTasksButton: {
    backgroundColor: "#fbeee0",
    border: "2px solid #422800",
    borderRadius: 30,
    color: "#422800",
    fontWeight: "400",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 18,
    lineHeight: 50,
    transform: [{ scale: 0.9 }],
  },
  sortTasksButtonSelected: {
    boxShadow: "#422800 -4px -4px 0 0",
    fontWeight: "bold",
    fontSize: 18,
    transform: [{ scale: 1 }],
  },
  sortTasksButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

export default TaskFilterButtons;
