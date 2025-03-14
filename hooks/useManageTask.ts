import { useState } from "react";

const useManageTask = () => {
  const [isModalWindowOpened, setModalOpened] = useState(false);
  const [isTaskEditMode, setTaskEditMode] = useState(false);
  const [activeTask, setActiveTask] = useState("");
  const [deleteTask, setDeleteTask] = useState("");

  return {
    isModalWindowOpened,
    isTaskEditMode,
    activeTask,
    setModalOpened,
    setTaskEditMode,
    setActiveTask,
    deleteTask,
    setDeleteTask,
  };
};

export default useManageTask;
