import { describe, expect, it } from "vitest";
import { DateUtils } from "./date.utils";

describe("DateUtils", () => {
  describe("isWeekend", () => {
    it("should return true if date is Saturday", () => {
      const date = new Date("2021-06-13");

      const result = DateUtils.isWeekend(date);

      expect(result).toBe(true);
    });
    it("should return true if date is Sunday", () => {
      const date = new Date("2021-06-14");

      const result = DateUtils.isWeekend(date);

      expect(result).toBe(true);
    });
    it("should return false if date is Monday", () => {
      const date = new Date("2021-06-15");

      const result = DateUtils.isWeekend(date);

      expect(result).toBe(false);
    });
  });

  describe("isHoliday", () => {
    it("should return true if date is holiday", () => {
      const date = new Date("2023-01-01T03:00:00.000Z");

      const result = DateUtils.isHoliday(date);

      expect(result).toBe(true);
    });
    it("should return false if date is not holiday", () => {
      const date = new Date("2021-06-15");

      const result = DateUtils.isHoliday(date);

      expect(result).toBe(false);
    });
  });

  describe("getIntervalDates", () => {
    it("should return an array of dates between two dates", () => {
      const startDate = new Date("2021-06-15");
      const endDate = new Date("2021-06-18");

      const result = DateUtils.getIntervalDates(startDate, endDate);

      expect(result).toEqual([
        new Date("2021-06-15T00:00:00.000Z"),
        new Date("2021-06-16T00:00:00.000Z"),
        new Date("2021-06-17T00:00:00.000Z"),
        new Date("2021-06-18T00:00:00.000Z"),
      ]);
    });
    it("should return an array of dates between two dates without weekends", () => {
      const startDate = new Date("2021-06-15T03:00:00.000Z");
      const endDate = new Date("2021-06-19T03:00:00.000Z");

      const result = DateUtils.getIntervalDates(startDate, endDate);

      expect(result).toEqual([
        new Date("2021-06-15T03:00:00.000Z"),
        new Date("2021-06-16T03:00:00.000Z"),
        new Date("2021-06-17T03:00:00.000Z"),
        new Date("2021-06-18T03:00:00.000Z"),
      ]);
    });
    it.only("should return an array of dates between two dates without weekends and holidays", () => {
      const startDate = new Date("2023-01-01T03:00:00.000Z");
      const endDate = new Date("2023-01-07T03:00:00.000Z");

      const result = DateUtils.getIntervalDates(startDate, endDate);

      expect(result).toEqual([
        new Date("2023-01-02T03:00:00.000Z"),
        new Date("2023-01-03T03:00:00.000Z"),
        new Date("2023-01-04T03:00:00.000Z"),
        new Date("2023-01-05T03:00:00.000Z"),
        new Date("2023-01-06T03:00:00.000Z"),
      ]);
    });
  });
});
