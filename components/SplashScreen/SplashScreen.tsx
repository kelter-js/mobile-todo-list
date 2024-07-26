import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useLoadContext } from "../../context/LoadContext";

const SplashScreen = () => {
  const { action } = useLoadContext();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={120} color="#e8b246" />
      <Text style={styles.text}>{action} tasks...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151030",
    height: "100%",
    width: "100%",
  },
  text: {
    color: "#e8b246",
    marginTop: 15,
    fontSize: 25,
  },
});

export default SplashScreen;
