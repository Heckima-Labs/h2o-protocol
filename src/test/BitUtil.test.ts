import { BitUtil } from "../utils/BitUtil";

describe("BitUtil", () => {
  // Test check method
  test("should check if a bit is set", () => {
    // 0b00001010 = 10 in decimal
    const value = 10;

    // Bit positions that are set (1, 3)
    expect(BitUtil.check(value, 1)).toBe(true);
    expect(BitUtil.check(value, 3)).toBe(true);

    // Bit positions that are not set (0, 2, 4 and above)
    expect(BitUtil.check(value, 0)).toBe(false);
    expect(BitUtil.check(value, 2)).toBe(false);
    expect(BitUtil.check(value, 4)).toBe(false);
    expect(BitUtil.check(value, 7)).toBe(false);
  });

  // Test set method
  test("should set a bit in a value", () => {
    // 0b00001010 = 10 in decimal
    const value = 10;

    // Set already set bits (1, 3)
    expect(BitUtil.set(value, 1)).toBe(10); // No change
    expect(BitUtil.set(value, 3)).toBe(10); // No change

    // Set unset bits (0, 2, 4)
    expect(BitUtil.set(value, 0)).toBe(11); // 0b00001011
    expect(BitUtil.set(value, 2)).toBe(14); // 0b00001110
    expect(BitUtil.set(value, 4)).toBe(26); // 0b00011010

    // Set bit in zero
    expect(BitUtil.set(0, 5)).toBe(32); // 0b00100000
  });

  // Test clear method
  test("should clear a bit in a value", () => {
    // 0b00001010 = 10 in decimal
    const value = 10;

    // Clear already clear bits (0, 2, 4)
    expect(BitUtil.clear(value, 0)).toBe(10); // No change
    expect(BitUtil.clear(value, 2)).toBe(10); // No change
    expect(BitUtil.clear(value, 4)).toBe(10); // No change

    // Clear set bits (1, 3)
    expect(BitUtil.clear(value, 1)).toBe(8); // 0b00001000
    expect(BitUtil.clear(value, 3)).toBe(2); // 0b00000010

    // Clear all bits one by one
    let result = value;
    result = BitUtil.clear(result, 1);
    result = BitUtil.clear(result, 3);
    expect(result).toBe(0);
  });

  // Test between method
  test("should get bits between positions", () => {
    // 0b01101010 = 106 in decimal
    const value = 106;

    // Get single bits
    expect(BitUtil.between(value, 0, 0)).toBe(0);
    expect(BitUtil.between(value, 1, 1)).toBe(1);
    expect(BitUtil.between(value, 2, 2)).toBe(0);
    expect(BitUtil.between(value, 3, 3)).toBe(1);

    // Get multiple bit ranges
    expect(BitUtil.between(value, 0, 3)).toBe(10); // 0b1010
    expect(BitUtil.between(value, 1, 4)).toBe(5); // 0b0101
    expect(BitUtil.between(value, 2, 6)).toBe(26); // 0b11010
    expect(BitUtil.between(value, 0, 7)).toBe(106); // Entire value

    // Test with different values
    expect(BitUtil.between(0xff, 0, 3)).toBe(15); // 0b1111
    expect(BitUtil.between(0xff, 4, 7)).toBe(15); // 0b1111
  });

  // Test bitCount method
  test("should count bits required to represent a value", () => {
    // Test edge cases
    expect(BitUtil.bitCount(0)).toBe(0);
    expect(BitUtil.bitCount(-1)).toBe(0);
    expect(BitUtil.bitCount(-100)).toBe(0);

    // Test powers of 2
    expect(BitUtil.bitCount(1)).toBe(1);
    expect(BitUtil.bitCount(2)).toBe(2);
    expect(BitUtil.bitCount(4)).toBe(3);
    expect(BitUtil.bitCount(8)).toBe(4);
    expect(BitUtil.bitCount(16)).toBe(5);
    expect(BitUtil.bitCount(32)).toBe(6);
    expect(BitUtil.bitCount(64)).toBe(7);
    expect(BitUtil.bitCount(128)).toBe(8);

    // Test other values
    expect(BitUtil.bitCount(3)).toBe(2); // 0b11
    expect(BitUtil.bitCount(5)).toBe(3); // 0b101
    expect(BitUtil.bitCount(10)).toBe(4); // 0b1010
    expect(BitUtil.bitCount(15)).toBe(4); // 0b1111
    expect(BitUtil.bitCount(100)).toBe(7); // 0b1100100
  });

  // Test isPowerOfTwo method
  test("should check if a value is a power of 2", () => {
    // Test with powers of 2
    expect(BitUtil.isPowerOfTwo(1)).toBe(true);
    expect(BitUtil.isPowerOfTwo(2)).toBe(true);
    expect(BitUtil.isPowerOfTwo(4)).toBe(true);
    expect(BitUtil.isPowerOfTwo(8)).toBe(true);
    expect(BitUtil.isPowerOfTwo(16)).toBe(true);
    expect(BitUtil.isPowerOfTwo(32)).toBe(true);
    expect(BitUtil.isPowerOfTwo(64)).toBe(true);
    expect(BitUtil.isPowerOfTwo(128)).toBe(true);

    // Test with non-powers of 2
    expect(BitUtil.isPowerOfTwo(0)).toBe(false);
    expect(BitUtil.isPowerOfTwo(-1)).toBe(false);
    expect(BitUtil.isPowerOfTwo(-2)).toBe(false);
    expect(BitUtil.isPowerOfTwo(3)).toBe(false);
    expect(BitUtil.isPowerOfTwo(5)).toBe(false);
    expect(BitUtil.isPowerOfTwo(6)).toBe(false);
    expect(BitUtil.isPowerOfTwo(7)).toBe(false);
    expect(BitUtil.isPowerOfTwo(9)).toBe(false);
    expect(BitUtil.isPowerOfTwo(10)).toBe(false);
    expect(BitUtil.isPowerOfTwo(15)).toBe(false);
    expect(BitUtil.isPowerOfTwo(100)).toBe(false);
  });
});
