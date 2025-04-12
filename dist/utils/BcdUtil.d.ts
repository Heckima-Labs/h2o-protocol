/**
 * Utility class for Binary-Coded Decimal (BCD) operations
 */
export declare class BcdUtil {
    /**
     * Converts a byte to BCD format
     * @param value The value to convert (0-99)
     * @returns The BCD value as a byte
     */
    static toByte(value: number): number;
    /**
     * Converts a BCD byte to integer
     * @param value The BCD value
     * @returns The integer value
     */
    static fromByte(value: number): number;
    /**
     * Reads an integer from a series of BCD bytes in a buffer
     * @param buffer The buffer to read from
     * @param offset The offset to start reading from
     * @param length The number of bytes to read
     * @returns The decoded integer value
     */
    static readInteger(buffer: Buffer, offset: number, length: number): number;
    /**
     * Writes an integer as BCD bytes to a buffer
     * @param value The value to write
     * @param buffer The buffer to write to
     * @param offset The offset to start writing at
     * @param length The number of bytes to write
     */
    static writeInteger(value: number, buffer: Buffer, offset: number, length: number): void;
    /**
     * Reads a string from a series of BCD bytes in a buffer
     * @param buffer The buffer to read from
     * @param offset The offset to start reading from
     * @param length The number of bytes to read
     * @returns The decoded string
     */
    static readString(buffer: Buffer, offset: number, length: number): string;
    /**
     * Writes a string as BCD bytes to a buffer
     * @param value The string to write (must be hexadecimal digits)
     * @param buffer The buffer to write to
     * @param offset The offset to start writing at
     * @param length The number of bytes to write
     */
    static writeString(value: string, buffer: Buffer, offset: number, length: number): void;
}
