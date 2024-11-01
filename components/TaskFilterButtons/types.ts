import { SORT_DIRECTIONS } from "../../entities/SortDirections";
import { ViewModes } from "../../enums";

export interface TaskFilterButtonsProps {
  isViewModeInProgress: boolean;
  setViewMode: (viewMode: keyof typeof ViewModes) => void;
  sortDirection: SORT_DIRECTIONS;
  handleChangeSortDirection: VoidFunction;
  hasSortButton: boolean;
}
