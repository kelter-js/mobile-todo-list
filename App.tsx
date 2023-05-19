import { StyleSheet, Text, View } from 'react-native';

import Task from './components/Task';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Today`s tasks</Text>

        <View style={styles.items}>
          <Task text="first task" />
          <Task text="second task" />
          <Task text="test task" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
});

export default App;