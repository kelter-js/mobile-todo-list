import { FC } from "react";
import { StyleSheet, ImageBackground, View, Text } from "react-native";

import getFormattedDateObject from "../../utils/getFormattedDateObject";
import { DateDisplayProps } from "./types";
import { getSeasonImage } from "./utils";

const DateDisplay: FC<DateDisplayProps> = ({ date }) => {
  const { year, month, monthDate, hour, minutes, season } =
    getFormattedDateObject(date);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>Дата напоминания:</View>

      <ImageBackground
        resizeMode="stretch"
        style={styles.backgroundImage}
        source={getSeasonImage(season)}
      />

      <View style={styles.container}>
        <View style={styles.dateItem}>
          <Text style={styles.dateTitle}>Год</Text>
          <Text style={styles.dateValue}>{year}</Text>
        </View>

        <View style={styles.dateItem}>
          <Text style={styles.dateTitle}>Месяц</Text>
          <Text style={styles.dateValue}>{month}</Text>
        </View>

        <View style={styles.dateItem}>
          <Text style={styles.dateTitle}>Дата</Text>
          <Text style={styles.dateValue}>{monthDate}</Text>
        </View>

        <View>
          <Text style={styles.dateTitle}>Время</Text>
          <Text style={styles.dateValue}>{`${hour} : ${minutes}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    height: 40,
    paddingTop: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  dateItem: {
    height: 47,
    borderRightColor: "rgb(165, 166, 167)",
    borderRightWidth: 3,
    paddingBottom: 10,
    paddingRight: 10,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(165, 166, 167)",
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgb(165, 166, 167)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
    marginTop: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    fontWeight: "bold",
    fontSize: 24,
    color: "#aeb0b0",
  },
  backgroundImage: {
    width: "100%",
    height: 120,
  },
});

export default DateDisplay;
