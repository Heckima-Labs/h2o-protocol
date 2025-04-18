/**
 * Utility class for Binary-Coded Decimal (BCD) operations
 */
export class BcdUtil {
  /**
   * Converts a byte to BCD format
   * @param value The value to convert (0-99)
   * @returns The BCD value as a byte
   */
  public static toByte(value: number): number {
    return ((Math.floor(value / 10) << 4) & 0xf0) | (value % 10 & 0x0f);
  }

  /**
   * Converts a BCD byte to integer
   * @param value The BCD value
   * @returns The integer value
   */
  public static fromByte(value: number): number {
    return ((value >> 4) & 0xf) * 10 + (value & 0xf);
  }

  /**
   * Reads an integer from a series of BCD bytes in a buffer
   * @param buffer The buffer to read from
   * @param offset The offset to start reading from
   * @param length The number of bytes to read
   * @returns The decoded integer value
   */
  public static readInteger(
    buffer: Buffer,
    offset: number,
    length: number
  ): number {
    let result = 0;
    for (let i = 0; i < length; i++) {
      result = result * 100 + BcdUtil.fromByte(buffer[offset + i]);
    }
    return result;
  }

  /**
   * Writes an integer as BCD bytes to a buffer
   * @param value The value to write
   * @param buffer The buffer to write to
   * @param offset The offset to start writing at
   * @param length The number of bytes to write
   */
  public static writeInteger(
    value: number,
    buffer: Buffer,
    offset: number,
    length: number
  ): void {
    for (let i = length - 1; i >= 0; i--) {
      buffer[offset + i] = BcdUtil.toByte(value % 100);
      value = Math.floor(value / 100);
    }
  }

  /**
   * Reads a string from a series of BCD bytes in a buffer
   * @param buffer The buffer to read from
   * @param offset The offset to start reading from
   * @param length The number of bytes to read
   * @returns The decoded string
   */
  public static readString(
    buffer: Buffer,
    offset: number,
    length: number
  ): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const digit1 = (buffer[offset + i] >> 4) & 0xf;
      const digit2 = buffer[offset + i] & 0xf;

      // Convert to characters, skip if value is 0xF (often used as filler)
      if (digit1 !== 0xf) {
        result += digit1.toString(16).toUpperCase();
      }
      if (digit2 !== 0xf) {
        result += digit2.toString(16).toUpperCase();
      }
    }
    return result;
  }

  /**
   * Writes a string as BCD bytes to a buffer
   * @param value The string to write (must be hexadecimal digits)
   * @param buffer The buffer to write to
   * @param offset The offset to start writing at
   * @param length The number of bytes to write
   */
  public static writeString(
    value: string,
    buffer: Buffer,
    offset: number,
    length: number
  ): void {
    const valueStr = value.toUpperCase();
    const digits = valueStr.length;

    // Fill remaining bytes with 0xFF
    for (let i = 0; i < length; i++) {
      if (i * 2 >= digits) {
        buffer[offset + i] = 0xff;
      } else {
        const digit1 = i * 2 < digits ? parseInt(valueStr[i * 2], 16) : 0xf;
        const digit2 =
          i * 2 + 1 < digits ? parseInt(valueStr[i * 2 + 1], 16) : 0xf;
        buffer[offset + i] = (digit1 << 4) | digit2;
      }
    }
  }
}
