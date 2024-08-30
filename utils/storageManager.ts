import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { ITask } from "../models";
import dateReviver from "./dateReviver";

const TASKS_LIST_KEY = "tasksList";

const INITIAL_TASKS = [
  {
    id: uuid.v1(),
    description: "blah-blah",
    title: "first task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jun 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "date-testing",
    title: "Should render date in short format, just time",
    isRepeatable: false,
    triggerDate: new Date(Date.now() + 150000),
  },
  {
    id: uuid.v1(),
    description: "bleh-bleh",
    title: "second task",
    isRepeatable: false,
    triggerDate: new Date("Sat Sep 13 2024 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "bluh-bluh",
    title: "third task",
    isRepeatable: false,
    triggerDate: new Date("Sat Jan 13 2025 00:05:29 GMT+0500"),
  },
  {
    id: uuid.v1(),
    description: "date-testing",
    title: "date testing task description",
    isRepeatable: true,
    triggerDate: new Date("Sat Jan 13 2022 00:05:29 GMT+0500"),
  },
];

const storageManager = {
  async getTasksList() {
    try {
      const tasksList = await AsyncStorage.getItem(TASKS_LIST_KEY);

      if (tasksList) {
        return JSON.parse(tasksList, dateReviver);
      }

      return INITIAL_TASKS;
    } catch (e) {
      return INITIAL_TASKS;
    }
  },
  async updateTasksList(newList: ITask[]) {
    try {
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem(TASKS_LIST_KEY, jsonValue);
    } catch (e) {
      const error = e;
    }
  },
};

export default storageManager;
