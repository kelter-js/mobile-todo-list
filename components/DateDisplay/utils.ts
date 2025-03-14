import { YEAR_SEASONS } from "../../enums";
import { backgroundPaths } from "./constants";

export const getSeasonImage = (season: keyof typeof YEAR_SEASONS) => {
  switch (season) {
    case YEAR_SEASONS.AUTUMN:
      return backgroundPaths[0];
    case YEAR_SEASONS.SPRING:
      return backgroundPaths[1];
    case YEAR_SEASONS.SUMMER:
      return backgroundPaths[2];
    case YEAR_SEASONS.WINTER:
      return backgroundPaths[3];
  }
};
