import dayjs from "dayjs";
import { holidays } from "./date.constants";

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isHoliday = (date: Date) => {
  const dateFormatted = dayjs(date).format("YYYY-MM-DD");

  return !!holidays.find((holiday) => holiday.date === dateFormatted);
};

const getIntervalDates = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = startDate;
  const addDays = function (this: Date, days: number) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }

  return dates.filter((date) => !isWeekend(date) && !isHoliday(date));
};

export const DateUtils = {
  isWeekend,
  isHoliday,
  getIntervalDates,
};
