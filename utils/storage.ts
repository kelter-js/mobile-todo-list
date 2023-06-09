import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: any) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    alert(e);
  }
}
