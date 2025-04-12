/**
 * Utility class for building dates from various sources
 */
export class DateBuilder {
  private readonly date: Date;

  /**
   * Creates a new date builder with the current date or a specified date
   * @param date Optional date to start with (default: current date)
   */
  constructor(date?: Date) {
    this.date = date ? new Date(date) : new Date();
  }

  /**
   * Sets the year component
   * @param year The year (full 4-digit year)
   * @returns This DateBuilder instance for chaining
   */
  public setYear(year: number): this {
    this.date.setUTCFullYear(year);
    return this;
  }

  /**
   * Sets the month component (1-12)
   * @param month The month (1-12, NOT 0-11)
   * @returns This DateBuilder instance for chaining
   */
  public setMonth(month: number): this {
    this.date.setUTCMonth(month - 1); // JavaScript months are 0-based
    return this;
  }

  /**
   * Sets the day component
   * @param day The day (1-31)
   * @returns This DateBuilder instance for chaining
   */
  public setDay(day: number): this {
    this.date.setUTCDate(day);
    return this;
  }

  /**
   * Sets the hour component
   * @param hour The hour (0-23)
   * @returns This DateBuilder instance for chaining
   */
  public setHour(hour: number): this {
    this.date.setUTCHours(hour);
    return this;
  }

  /**
   * Sets the minute component
   * @param minute The minute (0-59)
   * @returns This DateBuilder instance for chaining
   */
  public setMinute(minute: number): this {
    this.date.setUTCMinutes(minute);
    return this;
  }

  /**
   * Sets the second component
   * @param second The second (0-59)
   * @returns This DateBuilder instance for chaining
   */
  public setSecond(second: number): this {
    this.date.setUTCSeconds(second);
    return this;
  }

  /**
   * Sets the millisecond component
   * @param millisecond The millisecond (0-999)
   * @returns This DateBuilder instance for chaining
   */
  public setMillisecond(millisecond: number): this {
    this.date.setUTCMilliseconds(millisecond);
    return this;
  }

  /**
   * Sets date components (year, month, day)
   * @param year The year (full 4-digit year)
   * @param month The month (1-12, NOT 0-11)
   * @param day The day (1-31)
   * @returns This DateBuilder instance for chaining
   */
  public setDate(year: number, month: number, day: number): this {
    this.setYear(year);
    this.setMonth(month);
    this.setDay(day);
    return this;
  }

  /**
   * Sets time components (hour, minute, second, millisecond)
   * @param hour The hour (0-23)
   * @param minute The minute (0-59)
   * @param second The second (0-59)
   * @param millisecond The millisecond (0-999, optional)
   * @returns This DateBuilder instance for chaining
   */
  public setTime(
    hour: number,
    minute: number,
    second: number,
    millisecond: number = 0
  ): this {
    this.setHour(hour);
    this.setMinute(minute);
    this.setSecond(second);
    this.setMillisecond(millisecond);
    return this;
  }

  /**
   * Sets the date with year, month, and day in reverse order (day, month, year)
   * Useful for many date formats that use day-month-year ordering
   * @param day The day (1-31)
   * @param month The month (1-12, NOT 0-11)
   * @param year The year (full 4-digit year, or 2-digit which gets converted to 2000+year or 1900+year)
   * @returns This DateBuilder instance for chaining
   */
  public setDateReverse(day: number, month: number, year: number): this {
    // If the year is specified as two digits, convert it to four digits
    if (year < 100) {
      if (year >= 70) {
        year += 1900;
      } else {
        year += 2000;
      }
    }

    return this.setDate(year, month, day);
  }

  /**
   * Gets the built date
   * @returns The built Date object
   */
  public getDate(): Date {
    return new Date(this.date);
  }

  /**
   * Gets the built date as a UTC timestamp in milliseconds
   * @returns The timestamp in milliseconds
   */
  public getTimestamp(): number {
    return this.date.getTime();
  }
}
