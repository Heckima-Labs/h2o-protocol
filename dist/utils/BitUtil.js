"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitUtil = void 0;
/**
 * Utility class for bit manipulation
 */
class BitUtil {
    /**
     * Checks if a bit at a specified position is set in the value
     * @param value The value to check
     * @param pos The bit position (0-based)
     * @returns true if the bit is set, false otherwise
     */
    static check(value, pos) {
        return ((value >> pos) & 1) === 1;
    }
    /**
     * Sets a bit at a specified position in the value
     * @param value The original value
     * @param pos The bit position (0-based)
     * @returns The value with the bit set
     */
    static set(value, pos) {
        return value | (1 << pos);
    }
    /**
     * Clears a bit at a specified position in the value
     * @param value The original value
     * @param pos The bit position (0-based)
     * @returns The value with the bit cleared
     */
    static clear(value, pos) {
        return value & ~(1 << pos);
    }
    /**
     * Gets a range of bits from a value
     * @param value The value
     * @param start Start position (inclusive, 0-based)
     * @param end End position (inclusive, 0-based)
     * @returns The masked value
     */
    static between(value, start, end) {
        const mask = ((1 << (end - start + 1)) - 1) << start;
        return (value & mask) >> start;
    }
    /**
     * Gets the number of bits required to represent a value
     * @param value The value
     * @returns The number of bits required
     */
    static bitCount(value) {
        if (value <= 0) {
            return 0;
        }
        return Math.floor(Math.log2(value)) + 1;
    }
    /**
     * Checks if a value is a power of 2
     * @param value The value to check
     * @returns true if the value is a power of 2, false otherwise
     */
    static isPowerOfTwo(value) {
        return value > 0 && (value & (value - 1)) === 0;
    }
}
exports.BitUtil = BitUtil;
//# sourceMappingURL=BitUtil.js.map