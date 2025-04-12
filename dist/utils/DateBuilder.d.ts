/**
 * Utility class for building dates from various sources
 */
export declare class DateBuilder {
    private date;
    /**
     * Creates a new date builder with the current date or a specified date
     * @param date Optional date to start with (default: current date)
     */
    constructor(date?: Date);
    /**
     * Sets the year component
     * @param year The year (full 4-digit year)
     * @returns This DateBuilder instance for chaining
     */
    setYear(year: number): DateBuilder;
    /**
     * Sets the month component (1-12)
     * @param month The month (1-12, NOT 0-11)
     * @returns This DateBuilder instance for chaining
     */
    setMonth(month: number): DateBuilder;
    /**
     * Sets the day component
     * @param day The day (1-31)
     * @returns This DateBuilder instance for chaining
     */
    setDay(day: number): DateBuilder;
    /**
     * Sets the hour component
     * @param hour The hour (0-23)
     * @returns This DateBuilder instance for chaining
     */
    setHour(hour: number): DateBuilder;
    /**
     * Sets the minute component
     * @param minute The minute (0-59)
     * @returns This DateBuilder instance for chaining
     */
    setMinute(minute: number): DateBuilder;
    /**
     * Sets the second component
     * @param second The second (0-59)
     * @returns This DateBuilder instance for chaining
     */
    setSecond(second: number): DateBuilder;
    /**
     * Sets the millisecond component
     * @param millisecond The millisecond (0-999)
     * @returns This DateBuilder instance for chaining
     */
    setMillisecond(millisecond: number): DateBuilder;
    /**
     * Sets date components (year, month, day)
     * @param year The year (full 4-digit year)
     * @param month The month (1-12, NOT 0-11)
     * @param day The day (1-31)
     * @returns This DateBuilder instance for chaining
     */
    setDate(year: number, month: number, day: number): DateBuilder;
    /**
     * Sets time components (hour, minute, second, millisecond)
     * @param hour The hour (0-23)
     * @param minute The minute (0-59)
     * @param second The second (0-59)
     * @param millisecond The millisecond (0-999, optional)
     * @returns This DateBuilder instance for chaining
     */
    setTime(hour: number, minute: number, second: number, millisecond?: number): DateBuilder;
    /**
     * Sets the date with year, month, and day in reverse order (day, month, year)
     * Useful for many date formats that use day-month-year ordering
     * @param day The day (1-31)
     * @param month The month (1-12, NOT 0-11)
     * @param year The year (full 4-digit year, or 2-digit which gets converted to 2000+year or 1900+year)
     * @returns This DateBuilder instance for chaining
     */
    setDateReverse(day: number, month: number, year: number): DateBuilder;
    /**
     * Gets the built date
     * @returns The built Date object
     */
    getDate(): Date;
    /**
     * Gets the built date as a UTC timestamp in milliseconds
     * @returns The timestamp in milliseconds
     */
    getTimestamp(): number;
}
