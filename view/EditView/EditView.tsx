import { FC } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { EditViewProps } from "./types";

const prefabImage = require("../../assets/background/static-bg.jpg");

export const EditView: FC<EditViewProps> = ({ children, onClose }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={prefabImage}
      />

      <Pressable style={styles.closeButton} onPress={onClose}>
        <EvilIcons name="close" size={24} color="white" />
      </Pressable>

      <View style={styles.contentContainer}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    height: "100%",
  },
  container: {
    position: "relative",
    flex: 1,
    height: "100%",
  },

  closeButton: {
    position: "absolute",
    left: 15,
    top: 16,
    zIndex: 250,
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
