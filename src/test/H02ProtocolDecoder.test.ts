import { H02ProtocolDecoder } from "../protocol/H02ProtocolDecoder";
import { Position } from "../models/Position";

describe("H02ProtocolDecoder", () => {
  let decoder: H02ProtocolDecoder;

  beforeEach(() => {
    decoder = new H02ProtocolDecoder();
  });

  test("should decode regular position message", () => {
    // Create a standard position message
    const message =
      "*HQ,123456789012345,V1,050316,A,2234.0297,N,11405.9101,E,000.0,000,120316,FFFFFBFF#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getDeviceId()).toEqual("123456789012345");
    expect(position?.getProtocol()).toEqual("h02");
    expect(position?.isValid()).toEqual(true);
    expect(position?.getLatitude()).toBeCloseTo(22.567162, 5);
    expect(position?.getLongitude()).toBeCloseTo(114.098502, 5);
    expect(position?.getSpeed()).toEqual(0);
    expect(position?.getCourse()).toEqual(0);
  });

  test("should decode V1 acknowledgement message", () => {
    // Create a V1 acknowledgement message
    const message = "*HQ,123456789012345,V1#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getDeviceId()).toEqual("123456789012345");
    expect(position?.getProtocol()).toEqual("h02");

    // Time should be set to current time
    const now = new Date();
    const positionTime = position?.getTime();
    expect(positionTime?.getFullYear()).toEqual(now.getFullYear());
    expect(positionTime?.getMonth()).toEqual(now.getMonth());
    expect(positionTime?.getDate()).toEqual(now.getDate());
  });

  test("should decode V4 response message", () => {
    // Create a V4 response message
    const message = "*HQ,123456789012345,V4,SUCCESS#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getDeviceId()).toEqual("123456789012345");
    expect(position?.getProtocol()).toEqual("h02");
    expect(position?.get(Position.KEY_RESULT)).toEqual("SUCCESS");
  });

  test("should decode heartbeat message", () => {
    // Create a heartbeat message
    const message = "*HQ,123456789012345,HTBT,80#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getDeviceId()).toEqual("123456789012345");
    expect(position?.getProtocol()).toEqual("h02");
    expect(position?.get(Position.KEY_BATTERY_LEVEL)).toEqual(80);
  });

  test("should decode position with status", () => {
    // Create a position message with status
    const message =
      "*HQ,123456789012345,V1,050316,A,2234.0297,N,11405.9101,E,000.0,000,120316,FFFFFBFF#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.get(Position.KEY_STATUS)).toEqual(0xfffffbff);
    expect(position?.get(Position.KEY_IGNITION)).toEqual(true); // Bit 10 is set
  });

  test("should decode position with alarm", () => {
    // Create a position message with alarm trigger (bit 0 not set)
    const message =
      "*HQ,123456789012345,V1,050316,A,2234.0297,N,11405.9101,E,000.0,000,120316,FFFFFFFE#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getAttributes().alarms).toContain(
      Position.ALARM_VIBRATION
    );
  });

  test("should handle empty buffer", () => {
    // Decode an empty buffer
    const position = decoder.decode(Buffer.alloc(0));

    // Verify the result
    expect(position).toBeNull();
  });

  test("should handle invalid message", () => {
    // Create an invalid message (not starting with *)
    const message =
      "INVALID,123456789012345,V1,050316,A,2234.0297,N,11405.9101,E,000.0,000,120316,FFFFFBFF#";
    const buffer = Buffer.from(message);

    // Decode the message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).toBeNull();
  });

  test("should decode binary message", () => {
    // Creating a binary message is complex, so mock a simple one
    const buffer = Buffer.alloc(32);
    buffer[0] = "$".charCodeAt(0); // Marker

    // Set device ID (5 bytes)
    buffer.write("12345", 1, "hex");

    // Set date/time (6 bytes - BCD format)
    buffer[6] = 0x14; // Hour (14)
    buffer[7] = 0x30; // Minute (30)
    buffer[8] = 0x15; // Second (15)
    buffer[9] = 0x25; // Day (25)
    buffer[10] = 0x12; // Month (12)
    buffer[11] = 0x22; // Year (22)

    // Set latitude (5 bytes)
    buffer[12] = 0x22; // Degrees (22)
    buffer[13] = 0x34; // Degrees (34)
    buffer[14] = 0x00; // Minutes
    buffer[15] = 0x29; // Minutes
    buffer[16] = 0x70; // Battery + Minutes

    // Set longitude (5 bytes)
    buffer[17] = 0x11; // Degrees (11)
    buffer[18] = 0x40; // Degrees (40)
    buffer[19] = 0x59; // Minutes
    buffer[20] = 0x10; // Minutes
    buffer[21] = 0x36; // Flags + Minutes

    // Set speed and course
    buffer[22] = 0x00; // Speed
    buffer[23] = 0x00; // Speed
    buffer[24] = 0x00; // Speed
    buffer[25] = 0x00; // Course high
    buffer[26] = 0x00; // Course low

    // Set status
    buffer.writeUInt32BE(0xfffffbff, 27);

    // Decode the binary message
    const position = decoder.decode(buffer);

    // Verify the result
    expect(position).not.toBeNull();
    expect(position?.getTime().getUTCHours()).toEqual(14);
    expect(position?.getTime().getUTCMinutes()).toEqual(30);
    expect(position?.getTime().getUTCSeconds()).toEqual(15);
    expect(position?.getTime().getUTCDate()).toEqual(25);
    expect(position?.getTime().getUTCMonth()).toEqual(11); // 0-based month
    expect(position?.getTime().getUTCFullYear()).toEqual(2022);
  });
});
