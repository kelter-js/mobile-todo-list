// heres template for future logic

// AsyncStorage.getItem("taskTime").then(async (value) => {
//   if (value !== null) {
//     const currentDate = new Date();
//     const taskDate = new Date(value);

//     if (!(taskDate > currentDate)) {
//       await AsyncStorage.removeItem("taskTime");
//       await AsyncStorage.removeItem("notificationId");
//     }
//   } else {
//     await AsyncStorage.removeItem("notificationId");
//   }
// });

const useInitiateTasks = () => {
  return [];
};

export default useInitiateTasks;
