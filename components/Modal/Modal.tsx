import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FC } from "react";
import { Ionicons } from "@expo/vector-icons";

import { IModalWindowProps } from "../../models";
import { getPercentage } from "../../utils/getPercentage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const DEFAULT_HEIGHT = 330;

const ModalWindow: FC<IModalWindowProps> = ({
  onCloseModal,
  children,
  isWindowOpened,
  height,
}) => {
  if (!isWindowOpened) {
    return null;
  }

  return (
    <View style={styles.centeredViewContainer}>
      <Modal animationType="fade" transparent={true} visible={true}>
        <TouchableOpacity onPress={onCloseModal} style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, { height: height || "auto" }]}>
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

                {children}
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

    width: getPercentage(90, windowWidth),
  },
  closeModalButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default ModalWindow;
