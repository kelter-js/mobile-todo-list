import { useState } from "react";
import { ViewModes } from "../enums";

const useViewMode = () => {
  const [viewMode, setViewMode] = useState<keyof typeof ViewModes>(
    ViewModes.IN_PROGRESS
  );

  const isViewModeInProgress = viewMode === ViewModes.IN_PROGRESS;

  return { viewMode, setViewMode, isViewModeInProgress };
};

export default useViewMode;
