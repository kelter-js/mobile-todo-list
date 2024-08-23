import { FC } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import { ViewModes } from "../../enums";

interface TaskFilterButtonsProps {
  isViewModeInProgress: boolean;
  setViewMode: (viewMode: keyof typeof ViewModes) => void;
}

const TaskFilterButtons: FC<TaskFilterButtonsProps> = ({
  isViewModeInProgress,
  setViewMode,
}) => {
  const handleSetFinishedViewMode = () => setViewMode(ViewModes.FINISHED);
  const handleSetInProgressViewMode = () => setViewMode(ViewModes.IN_PROGRESS);

  return (
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
  );
};

const styles = StyleSheet.create({
  sortControlsContainer: {
    maxHeight: 45,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
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
