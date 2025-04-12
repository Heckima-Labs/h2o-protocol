import { BcdUtil } from "../utils/BcdUtil";

describe("BcdUtil", () => {
  // Test toByte
  test("should convert decimal to BCD byte", () => {
    expect(BcdUtil.toByte(0)).toBe(0x00);
    expect(BcdUtil.toByte(9)).toBe(0x09);
    expect(BcdUtil.toByte(10)).toBe(0x10);
    expect(BcdUtil.toByte(42)).toBe(0x42);
    expect(BcdUtil.toByte(99)).toBe(0x99);
  });

  // Test fromByte
  test("should convert BCD byte to decimal", () => {
    expect(BcdUtil.fromByte(0x00)).toBe(0);
    expect(BcdUtil.fromByte(0x09)).toBe(9);
    expect(BcdUtil.fromByte(0x10)).toBe(10);
    expect(BcdUtil.fromByte(0x42)).toBe(42);
    expect(BcdUtil.fromByte(0x99)).toBe(99);
  });

  // Test readInteger
  test("should read BCD integer from buffer", () => {
    const buffer = Buffer.from([0x12, 0x34, 0x56, 0x78]);

    // Read various lengths
    expect(BcdUtil.readInteger(buffer, 0, 1)).toBe(12);
    expect(BcdUtil.readInteger(buffer, 0, 2)).toBe(1234);
    expect(BcdUtil.readInteger(buffer, 0, 3)).toBe(123456);
    expect(BcdUtil.readInteger(buffer, 0, 4)).toBe(12345678);

    // Read with offset
    expect(BcdUtil.readInteger(buffer, 1, 2)).toBe(3456);
    expect(BcdUtil.readInteger(buffer, 2, 2)).toBe(5678);
  });

  // Test writeInteger
  test("should write BCD integer to buffer", () => {
    const buffer = Buffer.alloc(4);

    // Write a single byte
    BcdUtil.writeInteger(42, buffer, 0, 1);
    expect(buffer[0]).toBe(0x42);

    // Write multiple bytes
    BcdUtil.writeInteger(12345678, buffer, 0, 4);
    expect(buffer[0]).toBe(0x12);
    expect(buffer[1]).toBe(0x34);
    expect(buffer[2]).toBe(0x56);
    expect(buffer[3]).toBe(0x78);

    // Write with offset
    const buffer2 = Buffer.alloc(6);
    BcdUtil.writeInteger(9876, buffer2, 2, 2);
    expect(buffer2[0]).toBe(0x00);
    expect(buffer2[1]).toBe(0x00);
    expect(buffer2[2]).toBe(0x98);
    expect(buffer2[3]).toBe(0x76);
    expect(buffer2[4]).toBe(0x00);
    expect(buffer2[5]).toBe(0x00);
  });

  // Test readString
  test("should read BCD string from buffer", () => {
    // Regular case
    const buffer1 = Buffer.from([0x12, 0x34, 0x56, 0x78]);
    expect(BcdUtil.readString(buffer1, 0, 4)).toBe("12345678");

    // With 0xF values as fillers (which should be skipped)
    const buffer2 = Buffer.from([0x1f, 0xf2, 0x3f, 0xf4]);
    expect(BcdUtil.readString(buffer2, 0, 4)).toBe("1234");

    // With offset
    expect(BcdUtil.readString(buffer1, 1, 2)).toBe("3456");
  });

  // Test writeString
  test("should write BCD string to buffer", () => {
    // Write regular hex string
    const buffer1 = Buffer.alloc(4);
    BcdUtil.writeString("12345678", buffer1, 0, 4);
    expect(buffer1[0]).toBe(0x12);
    expect(buffer1[1]).toBe(0x34);
    expect(buffer1[2]).toBe(0x56);
    expect(buffer1[3]).toBe(0x78);

    // Write string shorter than buffer length (should fill with 0xFF)
    const buffer2 = Buffer.alloc(4);
    BcdUtil.writeString("1234", buffer2, 0, 4);
    expect(buffer2[0]).toBe(0x12);
    expect(buffer2[1]).toBe(0x34);
    expect(buffer2[2]).toBe(0xff);
    expect(buffer2[3]).toBe(0xff);

    // Write with odd number of characters (should pad last byte with 0xF)
    const buffer3 = Buffer.alloc(4);
    BcdUtil.writeString("1234567", buffer3, 0, 4);
    expect(buffer3[0]).toBe(0x12);
    expect(buffer3[1]).toBe(0x34);
    expect(buffer3[2]).toBe(0x56);
    expect(buffer3[3]).toBe(0x7f);

    // Write with offset
    const buffer4 = Buffer.alloc(6);
    BcdUtil.writeString("ABCD", buffer4, 2, 2);
    expect(buffer4[0]).toBe(0x00);
    expect(buffer4[1]).toBe(0x00);
    expect(buffer4[2]).toBe(0xab);
    expect(buffer4[3]).toBe(0xcd);
    expect(buffer4[4]).toBe(0x00);
    expect(buffer4[5]).toBe(0x00);
  });

  // Test case-insensitivity in writeString
  test("should handle lowercase hexadecimal in writeString", () => {
    const buffer = Buffer.alloc(4);
    BcdUtil.writeString("abcdef12", buffer, 0, 4);
    expect(buffer[0]).toBe(0xab);
    expect(buffer[1]).toBe(0xcd);
    expect(buffer[2]).toBe(0xef);
    expect(buffer[3]).toBe(0x12);
  });

  // Test for edge cases in writeString
  test("should handle edge cases in writeString", () => {
    // Test specifically for the case where i * 2 < digits but i * 2 + 1 >= digits
    // This happens when the string has an odd number of characters and we're at the last character
    const buffer = Buffer.alloc(1);
    BcdUtil.writeString("A", buffer, 0, 1); // Just one character

    // The first digit should be A (0xA) and the second digit should be F (0xF)
    expect(buffer[0]).toBe(0xaf);

    // Another test with a longer string but still hitting the case
    const buffer2 = Buffer.alloc(3);
    BcdUtil.writeString("12345", buffer2, 0, 3); // 5 characters, odd number

    expect(buffer2[0]).toBe(0x12);
    expect(buffer2[1]).toBe(0x34);
    expect(buffer2[2]).toBe(0x5f); // Last character is '5' followed by F as padding
  });

  // Test specifically for line 110 where the branching condition i * 2 + 1 < digits is false
  test("should handle digit2 padding when at odd-length string", () => {
    // Mock the function to trace the execution path
    const spy = jest.spyOn(global, "parseInt");

    // Create a test buffer and a string with exactly 1 character
    const buffer = Buffer.alloc(1);
    BcdUtil.writeString("F", buffer, 0, 1);

    // Verify the buffer content
    expect(buffer[0]).toBe(0xff);

    // Verify that parseInt was called for digit1 but used the default 0xF for digit2
    expect(spy).toHaveBeenCalledWith("F", 16); // For digit1

    // Restore the original function
    spy.mockRestore();

    // Further tests with different odd-length strings
    const buffer2 = Buffer.alloc(2);
    BcdUtil.writeString("ABC", buffer2, 0, 2);

    expect(buffer2[0]).toBe(0xab);
    expect(buffer2[1]).toBe(0xcf); // Last byte should have C followed by F padding
  });
});
