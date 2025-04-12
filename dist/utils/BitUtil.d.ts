/**
 * Utility class for bit manipulation
 */
export declare class BitUtil {
    /**
     * Checks if a bit at a specified position is set in the value
     * @param value The value to check
     * @param pos The bit position (0-based)
     * @returns true if the bit is set, false otherwise
     */
    static check(value: number, pos: number): boolean;
    /**
     * Sets a bit at a specified position in the value
     * @param value The original value
     * @param pos The bit position (0-based)
     * @returns The value with the bit set
     */
    static set(value: number, pos: number): number;
    /**
     * Clears a bit at a specified position in the value
     * @param value The original value
     * @param pos The bit position (0-based)
     * @returns The value with the bit cleared
     */
    static clear(value: number, pos: number): number;
    /**
     * Gets a range of bits from a value
     * @param value The value
     * @param start Start position (inclusive, 0-based)
     * @param end End position (inclusive, 0-based)
     * @returns The masked value
     */
    static between(value: number, start: number, end: number): number;
    /**
     * Gets the number of bits required to represent a value
     * @param value The value
     * @returns The number of bits required
     */
    static bitCount(value: number): number;
    /**
     * Checks if a value is a power of 2
     * @param value The value to check
     * @returns true if the value is a power of 2, false otherwise
     */
    static isPowerOfTwo(value: number): boolean;
}
