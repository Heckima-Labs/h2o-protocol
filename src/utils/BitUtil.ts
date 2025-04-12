/**
 * Utility class for bit manipulation
 */
export class BitUtil {
  /**
   * Checks if a bit at a specified position is set in the value
   * @param value The value to check
   * @param pos The bit position (0-based)
   * @returns true if the bit is set, false otherwise
   */
  public static check(value: number, pos: number): boolean {
    return ((value >> pos) & 1) === 1;
  }

  /**
   * Sets a bit at a specified position in the value
   * @param value The original value
   * @param pos The bit position (0-based)
   * @returns The value with the bit set
   */
  public static set(value: number, pos: number): number {
    return value | (1 << pos);
  }

  /**
   * Clears a bit at a specified position in the value
   * @param value The original value
   * @param pos The bit position (0-based)
   * @returns The value with the bit cleared
   */
  public static clear(value: number, pos: number): number {
    return value & ~(1 << pos);
  }

  /**
   * Gets a range of bits from a value
   * @param value The value
   * @param start Start position (inclusive, 0-based)
   * @param end End position (inclusive, 0-based)
   * @returns The masked value
   */
  public static between(value: number, start: number, end: number): number {
    const mask = ((1 << (end - start + 1)) - 1) << start;
    return (value & mask) >> start;
  }

  /**
   * Gets the number of bits required to represent a value
   * @param value The value
   * @returns The number of bits required
   */
  public static bitCount(value: number): number {
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
  public static isPowerOfTwo(value: number): boolean {
    return value > 0 && (value & (value - 1)) === 0;
  }
}
