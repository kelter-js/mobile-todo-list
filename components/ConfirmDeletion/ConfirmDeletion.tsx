import React, { FC } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { ConfirmDeletionProps } from "../../models";

export const ConfirmDeletion: FC<ConfirmDeletionProps> = ({
  task,
  taskId,
  onRemoveTask,
  onClose,
}) => {
  const handleRemove = () => {
    onRemoveTask(taskId, true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Удалить задачу?</Text>

      <View style={styles.metaContainer}>
        <Text>Вы точно хотите удалить задачу:</Text>
        <Text>{`${task?.title}`}</Text>
        <Text>{`${task?.description}`}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.control} onPress={onClose}>
          <Text style={[styles.controlText, styles.controlTextWrapper]}>
            <MaterialIcons name="cancel" size={24} color="black" />
            Отмена
          </Text>
        </Pressable>

        <Pressable
          style={[styles.control, styles.deleteButton]}
          onPress={handleRemove}
        >
          <Text style={[styles.controlText, styles.controlTextWrapper]}>
            <MaterialIcons name="delete-sweep" size={24} color="red" />
            Удалить
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metaContainer: {
    marginTop: 15,
  },
  container: { flex: 1, flexDirection: "column", width: "100%" },
  controls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginTop: "auto",
  },
  mainTitle: {
    position: "absolute",
    top: -21,
    fontSize: 22,
    fontWeight: "bold",
  },
  deleteButton: {
    borderColor: "red",
  },
  control: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
    elevation: 2,
  },
  controlText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  controlTextWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "black",
  },
});
