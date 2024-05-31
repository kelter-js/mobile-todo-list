import { AppState, AppStateStatus } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

const useAppState = () => {
  const currentAppState = useRef(AppState.currentState);
  const [isAppVisible, setAppVisible] = useState(
    currentAppState.current === "active"
  );

  const handleAppChange = useCallback(async (nextAppState: AppStateStatus) => {
    currentAppState.current = nextAppState;
    setAppVisible(currentAppState.current === "active");
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppChange);

    return () => subscription.remove();
  }, []);

  return { isAppVisible };
};

export default useAppState;
