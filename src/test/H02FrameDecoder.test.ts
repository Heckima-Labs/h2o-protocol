import { H02FrameDecoder } from "../protocol/H02FrameDecoder";

// Mock constants to ensure we're testing specific conditions
const originalH02FrameDecoder = { ...H02FrameDecoder };
const MESSAGE_SHORT = 32;
const MESSAGE_LONG = 45;

describe("H02FrameDecoder", () => {
  let decoder: H02FrameDecoder;

  beforeEach(() => {
    // Create a decoder with auto message length detection
    decoder = new H02FrameDecoder(0);
  });

  test("should decode text message", () => {
    // Create a test message
    const message =
      "*HQ,123456789012345,V1,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF#";
    const buffer = Buffer.from(message);

    // Decode the message
    const result = decoder.decode(buffer);

    // Verify the result
    expect(result).not.toBeNull();
    expect(result?.toString()).toEqual(message);
  });

  test("should decode text message with extra data", () => {
    // Create a test message with extra data at the beginning
    const extraData = "EXTRA";
    const message =
      "*HQ,123456789012345,V1,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF#";
    const buffer = Buffer.from(extraData + message);

    // Decode the message
    const result = decoder.decode(buffer);

    // Verify the result
    expect(result).not.toBeNull();
    expect(result?.toString()).toEqual(message);
  });

  test("should handle incomplete message", () => {
    // Create an incomplete test message (missing the '#' at the end)
    const message =
      "*HQ,123456789012345,V1,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF";
    const buffer = Buffer.from(message);

    // Decode the message
    const result = decoder.decode(buffer);

    // Verify the result
    expect(result).toBeNull();
  });

  test("should decode binary messages with auto-detection", () => {
    // Create decoders with both message lengths
    const shortDecoder = new H02FrameDecoder(32);
    const longDecoder = new H02FrameDecoder(45);
    const autoDecoder = new H02FrameDecoder(0);

    // Create a short binary message (32 bytes)
    const shortMessage = Buffer.alloc(32);
    shortMessage[0] = "$".charCodeAt(0);
    for (let i = 1; i < shortMessage.length; i++) {
      shortMessage[i] = i;
    }

    // Create a long binary message (45 bytes)
    const longMessage = Buffer.alloc(45);
    longMessage[0] = "$".charCodeAt(0);
    for (let i = 1; i < longMessage.length; i++) {
      longMessage[i] = i;
    }

    // Test short message with short decoder
    const shortResult = shortDecoder.decode(shortMessage);
    expect(shortResult).not.toBeNull();
    expect(shortResult?.length).toEqual(32);

    // Test long message with long decoder
    const longResult = longDecoder.decode(longMessage);
    expect(longResult).not.toBeNull();
    expect(longResult?.length).toEqual(45);

    // Test short message with auto-detection
    const autoShortResult = autoDecoder.decode(shortMessage);
    expect(autoShortResult).not.toBeNull();
    expect(autoShortResult?.length).toEqual(32);

    // Test long message with auto-detection
    const autoLongResult = autoDecoder.decode(longMessage);
    expect(autoLongResult).not.toBeNull();
    expect(autoLongResult?.length).toEqual(45);
  });

  test("should decode X-format binary messages", () => {
    // Create a binary message with X marker
    const message = Buffer.alloc(32);
    message[0] = "X".charCodeAt(0);
    for (let i = 1; i < message.length; i++) {
      message[i] = i;
    }

    // Decode the message
    const result = decoder.decode(message);

    // Verify the result
    expect(result).not.toBeNull();
    expect(result?.length).toEqual(32);
    expect(result?.[0]).toEqual("X".charCodeAt(0));
  });

  test("should handle empty buffer", () => {
    // Decode an empty buffer
    const result = decoder.decode(Buffer.alloc(0));

    // Verify the result
    expect(result).toBeNull();
  });

  test("should handle null buffer", () => {
    // Decode a null buffer
    const result = decoder.decode(null as any);

    // Verify the result
    expect(result).toBeNull();
  });

  // New tests to achieve 100% coverage

  // Test for specific test case condition
  test("should handle specific test case with 45-byte message", () => {
    // Create a test message matching test case condition
    const message = Buffer.alloc(45);
    message[0] = "$".charCodeAt(0);

    // Use specific decoder with MESSAGE_LONG length
    const specificDecoder = new H02FrameDecoder(45);

    const result = specificDecoder.decode(message);

    expect(result).not.toBeNull();
    expect(result?.length).toBe(45);
  });

  // Test for incomplete binary frame with explicit length
  test("should handle incomplete binary frame with explicit length", () => {
    // Create a binary message shorter than specified length
    const message = Buffer.alloc(30);
    message[0] = "$".charCodeAt(0);

    // Use decoder with longer expected length
    const specificDecoder = new H02FrameDecoder(40);

    const result = specificDecoder.decode(message);

    expect(result).toBeNull();
  });

  // Test for incomplete X-format message with explicit length
  test("should handle incomplete X-format message with explicit length", () => {
    // Create an X-format message shorter than specified length
    const message = Buffer.alloc(20);
    message[0] = "X".charCodeAt(0);

    // Use decoder with longer expected length
    const specificDecoder = new H02FrameDecoder(25);

    const result = specificDecoder.decode(message);

    expect(result).toBeNull();
  });

  // Test for X-format message with custom length
  test("should handle X-format message with custom length", () => {
    // Create an X-format message
    const message = Buffer.alloc(40);
    message[0] = "X".charCodeAt(0);

    // Use decoder with custom length
    const specificDecoder = new H02FrameDecoder(35);

    const result = specificDecoder.decode(message);

    expect(result).not.toBeNull();
    expect(result?.length).toBe(35);
  });

  // Test for buffer with binary marker not at start
  test("should find and decode binary frames with marker not at start", () => {
    // Create a buffer with a $ marker in the middle, with enough data to make a valid binary frame
    const buffer = Buffer.alloc(50);
    buffer.write("GARBAGE", 0);
    buffer[7] = "$".charCodeAt(0);

    const result = decoder.decode(buffer);

    expect(result).not.toBeNull();
    expect(result?.[0]).toBe("$".charCodeAt(0));
  });

  // Test for buffer with X marker not at start
  test("should find and decode X-format frames with marker not at start", () => {
    // Create a buffer with an X marker in the middle, with enough data to make a valid binary frame
    const buffer = Buffer.alloc(50);
    buffer.write("GARBAGE", 0);
    buffer[7] = "X".charCodeAt(0);

    const result = decoder.decode(buffer);

    expect(result).not.toBeNull();
    expect(result?.[0]).toBe("X".charCodeAt(0));
  });

  // Test for buffer with no valid markers
  test("should return null when no valid markers are found", () => {
    // Create a buffer with no valid markers
    const buffer = Buffer.from("NOVALIDMARKERSINTHISBUFFER");

    const result = decoder.decode(buffer);

    expect(result).toBeNull();
  });

  // Test for extractTextFrame when no * is found
  test("should return null when no asterisk is found in extractTextFrame", () => {
    const buffer = Buffer.from("NoAsteriskInThisBuffer");

    // Use the private method directly
    const result = (decoder as any).extractTextFrame(buffer);

    expect(result).toBeNull();
  });

  // Test specifically targeting line 86 and 93 (Binary frame handling)
  test("should thoroughly test binary frame handling (lines 86 and 93)", () => {
    // Target line 86 - non-$ marker
    {
      const buffer = Buffer.from("ABC");
      const handleBinaryFrame = (decoder as any).handleBinaryFrame.bind(
        decoder
      );
      const result1 = handleBinaryFrame(buffer);
      expect(result1).toBeNull();
    }

    // Target line 93 - exactly SHORT message length
    {
      const buffer = Buffer.alloc(MESSAGE_SHORT);
      buffer[0] = "$".charCodeAt(0);
      // Create a custom decoder for zero-length detection
      const customDecoder = new H02FrameDecoder(0);
      const handleBinaryFrame = (customDecoder as any).handleBinaryFrame.bind(
        customDecoder
      );
      const result2 = handleBinaryFrame(buffer);
      expect(result2).not.toBeNull();
      expect(result2.length).toBe(MESSAGE_SHORT);
    }
  });

  // Test specifically targeting line 115 (X-format handling)
  test("should thoroughly test X-format handling (line 115)", () => {
    // Target line 115 - non-X marker
    const buffer = Buffer.from("ABC");
    const handleXFrame = (decoder as any).handleXFrame.bind(decoder);
    const result = handleXFrame(buffer);
    expect(result).toBeNull();
  });
});
