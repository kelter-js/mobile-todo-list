import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";
import { useState, useCallback, FC } from "react";
import { Ionicons } from "@expo/vector-icons";

import { IModalWindowProps } from "../../view";
import DatePicker from "../DatePicker";

const removeButtonDescription = (isViewModeInProgress: boolean) =>
  isViewModeInProgress ? "Mark as done" : "Delete";

const ModalWindow: FC<IModalWindowProps> = ({
  onCloseModal,
  onRemoveTask,
  onMoveTaskBack,
  onCreateReminder,
  taskId,
  isViewModeInProgress,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDateSelected, setDateSelected] = useState(false);

  const handleDateSelection = useCallback((date: Date) => {
    setDateSelected(true);
    setSelectedDate(date);
  }, []);

  return (
    <View style={styles.centeredViewContainer}>
      <Modal animationType="fade" transparent={true} visible={true}>
        <TouchableOpacity onPress={onCloseModal} style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={onCloseModal}
                >
                  <Ionicons
                    name="ios-close-circle-outline"
                    size={28}
                    color="#333"
                  />
                </TouchableOpacity>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={onRemoveTask}
                >
                  <Text style={styles.textStyle}>
                    {removeButtonDescription(isViewModeInProgress)}
                  </Text>
                </Pressable>

                {!isViewModeInProgress && (
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={onMoveTaskBack}
                  >
                    <Text style={styles.textStyle}>
                      Mark as unfinished task
                    </Text>
                  </Pressable>
                )}

                <TouchableOpacity disabled={!isDateSelected}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      !isDateSelected && styles.buttonDisabled,
                    ]}
                    onPress={() => onCreateReminder(selectedDate)}
                  >
                    <Text style={styles.textStyle}>
                      Remind me about this task later
                    </Text>
                  </Pressable>
                </TouchableOpacity>

                <DatePicker
                  setSelectedDate={handleDateSelection}
                  date={selectedDate}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredViewContainer: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    paddingTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 290,
    width: "90%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 22,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default ModalWindow;
