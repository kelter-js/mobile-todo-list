import { Pressable, View, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ViewModes } from "../../enums";
import { SORT_DIRECTIONS } from "../../entities/SortDirections";

import { useStateContext } from "../../context/StateContext";

const MIN_AMOUNT_OF_TASKS_TO_SORT = 1;

const TaskFilterButtons = () => {
  const {
    setViewMode,
    isViewModeInProgress,
    sortDirection,
    tasksToView,
    handleChangeSortDirection,
  } = useStateContext();

  const hasSortButton = tasksToView?.length > MIN_AMOUNT_OF_TASKS_TO_SORT;

  const handleChangeViewMode = () => {
    setViewMode(
      isViewModeInProgress ? ViewModes.FINISHED : ViewModes.IN_PROGRESS
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sortControlsContainer}>
        <View style={styles.content}>
          <Pressable onPress={handleChangeViewMode} style={styles.icon}>
            {isViewModeInProgress ? (
              <Entypo name="check" size={16} color="white" />
            ) : (
              <AntDesign name="close" size={16} color="white" />
            )}
          </Pressable>

          <Text style={styles.title}>
            {isViewModeInProgress ? "Текущие задачи" : "Завершенные задачи"}
          </Text>
        </View>
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
              color="rgb(165, 166, 167)"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    width: 35,
    minHeight: 35,
    backgroundColor: "#293238",
    borderRadius: 35 / 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#7d7f80",
    marginTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 119,
    minHeight: 119,
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
    border: "2px solid #293238",
    borderRadius: 12,
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
});

export default TaskFilterButtons;
