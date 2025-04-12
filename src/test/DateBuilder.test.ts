import { DateBuilder } from "../utils/DateBuilder";

describe("DateBuilder", () => {
  // Test constructor with default date (current time)
  test("should create builder with current date by default", () => {
    const now = new Date();
    const builder = new DateBuilder();
    const result = builder.getDate();

    // Timestamps should be very close (within 5ms due to test execution time)
    expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(5);
  });

  // Test constructor with provided date
  test("should create builder with specified date", () => {
    const specificDate = new Date(2023, 5, 15, 10, 30, 45);
    const builder = new DateBuilder(specificDate);
    const result = builder.getDate();

    expect(result.getTime()).toBe(specificDate.getTime());
    expect(result).not.toBe(specificDate); // Should be a new instance
  });

  // Test setYear
  test("should set year", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15));
    builder.setYear(2024);
    const result = builder.getDate();

    expect(result.getUTCFullYear()).toBe(2024);
  });

  // Test setMonth
  test("should set month (1-12)", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15));
    builder.setMonth(10); // October
    const result = builder.getDate();

    expect(result.getUTCMonth()).toBe(9); // JavaScript months are 0-based
  });

  // Test setDay
  test("should set day", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15));
    builder.setDay(20);
    const result = builder.getDate();

    expect(result.getUTCDate()).toBe(20);
  });

  // Test setHour
  test("should set hour", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15, 10));
    builder.setHour(15);
    const result = builder.getDate();

    expect(result.getUTCHours()).toBe(15);
  });

  // Test setMinute
  test("should set minute", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15, 10, 30));
    builder.setMinute(45);
    const result = builder.getDate();

    expect(result.getUTCMinutes()).toBe(45);
  });

  // Test setSecond
  test("should set second", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15, 10, 30, 15));
    builder.setSecond(45);
    const result = builder.getDate();

    expect(result.getUTCSeconds()).toBe(45);
  });

  // Test setMillisecond
  test("should set millisecond", () => {
    const builder = new DateBuilder(new Date(2023, 5, 15, 10, 30, 15, 100));
    builder.setMillisecond(500);
    const result = builder.getDate();

    expect(result.getUTCMilliseconds()).toBe(500);
  });

  // Test setDate
  test("should set full date (year, month, day)", () => {
    const builder = new DateBuilder();
    builder.setDate(2024, 7, 20);
    const result = builder.getDate();

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(6); // July is 6 in JS
    expect(result.getUTCDate()).toBe(20);
  });

  // Test setTime with default millisecond
  test("should set time (hour, minute, second) with default millisecond", () => {
    const builder = new DateBuilder();
    builder.setTime(15, 30, 45);
    const result = builder.getDate();

    expect(result.getUTCHours()).toBe(15);
    expect(result.getUTCMinutes()).toBe(30);
    expect(result.getUTCSeconds()).toBe(45);
    expect(result.getUTCMilliseconds()).toBe(0);
  });

  // Test setTime with custom millisecond
  test("should set time (hour, minute, second, millisecond)", () => {
    const builder = new DateBuilder();
    builder.setTime(15, 30, 45, 500);
    const result = builder.getDate();

    expect(result.getUTCHours()).toBe(15);
    expect(result.getUTCMinutes()).toBe(30);
    expect(result.getUTCSeconds()).toBe(45);
    expect(result.getUTCMilliseconds()).toBe(500);
  });

  // Test setDateReverse with 4-digit year
  test("should set date in reverse order (day, month, year) with 4-digit year", () => {
    const builder = new DateBuilder();
    builder.setDateReverse(20, 7, 2024);
    const result = builder.getDate();

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(6); // July is 6 in JS
    expect(result.getUTCDate()).toBe(20);
  });

  // Test setDateReverse with 2-digit year >= 70 (should be 1900+year)
  test("should set date in reverse order with 2-digit year >= 70", () => {
    const builder = new DateBuilder();
    builder.setDateReverse(20, 7, 90);
    const result = builder.getDate();

    expect(result.getUTCFullYear()).toBe(1990);
    expect(result.getUTCMonth()).toBe(6); // July is 6 in JS
    expect(result.getUTCDate()).toBe(20);
  });

  // Test setDateReverse with 2-digit year < 70 (should be 2000+year)
  test("should set date in reverse order with 2-digit year < 70", () => {
    const builder = new DateBuilder();
    builder.setDateReverse(20, 7, 25);
    const result = builder.getDate();

    expect(result.getUTCFullYear()).toBe(2025);
    expect(result.getUTCMonth()).toBe(6); // July is 6 in JS
    expect(result.getUTCDate()).toBe(20);
  });

  // Test method chaining
  test("should support method chaining", () => {
    const builder = new DateBuilder();
    const result = builder
      .setYear(2024)
      .setMonth(7)
      .setDay(20)
      .setHour(15)
      .setMinute(30)
      .setSecond(45)
      .setMillisecond(500)
      .getDate();

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(6); // July is 6 in JS
    expect(result.getUTCDate()).toBe(20);
    expect(result.getUTCHours()).toBe(15);
    expect(result.getUTCMinutes()).toBe(30);
    expect(result.getUTCSeconds()).toBe(45);
    expect(result.getUTCMilliseconds()).toBe(500);
  });

  // Test getTimestamp
  test("should get timestamp in milliseconds", () => {
    const specificDate = new Date(Date.UTC(2023, 5, 15, 10, 30, 45, 500));
    const builder = new DateBuilder(specificDate);
    const timestamp = builder.getTimestamp();

    expect(timestamp).toBe(specificDate.getTime());
  });
});
