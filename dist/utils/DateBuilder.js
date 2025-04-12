"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateBuilder = void 0;
/**
 * Utility class for building dates from various sources
 */
class DateBuilder {
    /**
     * Creates a new date builder with the current date or a specified date
     * @param date Optional date to start with (default: current date)
     */
    constructor(date) {
        this.date = date ? new Date(date) : new Date();
    }
    /**
     * Sets the year component
     * @param year The year (full 4-digit year)
     * @returns This DateBuilder instance for chaining
     */
    setYear(year) {
        this.date.setUTCFullYear(year);
        return this;
    }
    /**
     * Sets the month component (1-12)
     * @param month The month (1-12, NOT 0-11)
     * @returns This DateBuilder instance for chaining
     */
    setMonth(month) {
        this.date.setUTCMonth(month - 1); // JavaScript months are 0-based
        return this;
    }
    /**
     * Sets the day component
     * @param day The day (1-31)
     * @returns This DateBuilder instance for chaining
     */
    setDay(day) {
        this.date.setUTCDate(day);
        return this;
    }
    /**
     * Sets the hour component
     * @param hour The hour (0-23)
     * @returns This DateBuilder instance for chaining
     */
    setHour(hour) {
        this.date.setUTCHours(hour);
        return this;
    }
    /**
     * Sets the minute component
     * @param minute The minute (0-59)
     * @returns This DateBuilder instance for chaining
     */
    setMinute(minute) {
        this.date.setUTCMinutes(minute);
        return this;
    }
    /**
     * Sets the second component
     * @param second The second (0-59)
     * @returns This DateBuilder instance for chaining
     */
    setSecond(second) {
        this.date.setUTCSeconds(second);
        return this;
    }
    /**
     * Sets the millisecond component
     * @param millisecond The millisecond (0-999)
     * @returns This DateBuilder instance for chaining
     */
    setMillisecond(millisecond) {
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
    setDate(year, month, day) {
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
    setTime(hour, minute, second, millisecond = 0) {
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
    setDateReverse(day, month, year) {
        // If the year is specified as two digits, convert it to four digits
        if (year < 100) {
            if (year >= 70) {
                year += 1900;
            }
            else {
                year += 2000;
            }
        }
        return this.setDate(year, month, day);
    }
    /**
     * Gets the built date
     * @returns The built Date object
     */
    getDate() {
        return new Date(this.date);
    }
    /**
     * Gets the built date as a UTC timestamp in milliseconds
     * @returns The timestamp in milliseconds
     */
    getTimestamp() {
        return this.date.getTime();
    }
}
exports.DateBuilder = DateBuilder;
//# sourceMappingURL=DateBuilder.js.map