import { FC } from "react";
import { StyleSheet, ImageBackground } from "react-native";

import getFormattedDateObject from "../../utils/getFormattedDateObject";
import { YEAR_SEASONS } from "../../enums";

interface DateDisplayProps {
  date: Date;
}

const backgroundPaths = [
  require("../../assets/icons/autumn.png"),
  require("../../assets/icons/spring.png"),
  require("../../assets/icons/summer.png"),
  require("../../assets/icons/winter.png"),
];

const getSeasonImage = (season: keyof typeof YEAR_SEASONS) => {
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

const DateDisplay: FC<DateDisplayProps> = ({ date }) => {
  const { year, month, monthDate, hour, minutes, season } =
    getFormattedDateObject(date);

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>Selected date is:</div>

      <ImageBackground
        resizeMode="stretch"
        style={styles.backgroundImage}
        source={getSeasonImage(season)}
      />

      <div>
        <div>Год</div>
        <div>{year}</div>
      </div>

      <div>
        <div>Месяц</div>
        <div>{month}</div>
      </div>

      <div>
        <div>Дата</div>
        <div>{monthDate}</div>
      </div>

      <div>
        <div>Время</div>
        <div>{`${hour} : ${minutes}`}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
  },
  backgroundImage: {
    width: "100%",
    height: 120,
  },
});

export default DateDisplay;
