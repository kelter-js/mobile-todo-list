import { FC } from "react";
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
      <Text>Вы точно хотите удалить задачу:</Text>
      <Text>{`${task.title}`}</Text>
      <Text>{`${task.description}`}</Text>

      <View style={styles.controls}>
        <Pressable style={styles.control} onPress={onClose}>
          <Text style={styles.controlText}>Отмена</Text>
        </Pressable>
        <Pressable style={styles.control} onPress={handleRemove}>
          <Text style={styles.controlText}>Удалить</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", width: "100%" },
  controls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginTop: "auto",
  },
  control: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
    elevation: 2,
  },
  controlText: {
    fontSize: 18,
  },
});
