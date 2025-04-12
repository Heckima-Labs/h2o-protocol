import { H02ProtocolEncoder } from "../protocol/H02ProtocolEncoder";
import { Command } from "../models/Command";

describe("H02ProtocolEncoder", () => {
  let encoder: H02ProtocolEncoder;

  beforeEach(() => {
    encoder = new H02ProtocolEncoder();
  });

  test("should encode ALARM_ARM command", () => {
    // Create the command
    const command = new Command(Command.TYPE_ALARM_ARM, "123456789012345");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result format (can't check exact time)
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,SCF,\d{6},0,0#$/);
  });

  test("should encode ALARM_DISARM command", () => {
    // Create the command
    const command = new Command(Command.TYPE_ALARM_DISARM, "123456789012345");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result format
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,SCF,\d{6},1,1#$/);
  });

  test("should encode ENGINE_STOP command", () => {
    // Create the command
    const command = new Command(Command.TYPE_ENGINE_STOP, "123456789012345");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result format
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,S20,\d{6},1,1#$/);
  });

  test("should encode ENGINE_RESUME command", () => {
    // Create the command
    const command = new Command(Command.TYPE_ENGINE_RESUME, "123456789012345");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result format
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,S20,\d{6},1,0#$/);
  });

  test("should encode POSITION_PERIODIC command", () => {
    // Create the command
    const command = new Command(
      Command.TYPE_POSITION_PERIODIC,
      "123456789012345"
    );
    command.set(Command.KEY_FREQUENCY, "60");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result format
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,S71,\d{6},22,60#$/);
  });

  test("should encode POSITION_PERIODIC command with alternative format", () => {
    // Create the command with the alternative format config
    const alternativeConfig = { "protocol.alternative.123456789012345": true };
    const alternativeEncoder = new H02ProtocolEncoder(alternativeConfig);

    const command = new Command(
      Command.TYPE_POSITION_PERIODIC,
      "123456789012345"
    );
    command.set(Command.KEY_FREQUENCY, "60");

    // Encode the command
    const result = alternativeEncoder.encode(command);

    // Verify the result format
    expect(result).not.toBeNull();
    expect(result).toMatch(/^\*HQ,123456789012345,D1,\d{6},60#$/);
  });

  test("should handle unsupported command", () => {
    // Create an unsupported command
    const command = new Command("unsupportedCommand", "123456789012345");

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result
    expect(result).toBeNull();
  });

  test("should handle missing frequency parameter", () => {
    // Create a command without frequency
    const command = new Command(
      Command.TYPE_POSITION_PERIODIC,
      "123456789012345"
    );

    // Encode the command
    const result = encoder.encode(command);

    // Verify the result
    expect(result).toBeNull();
  });

  test("should use specified time for command", () => {
    // Create a command
    const command = new Command(Command.TYPE_ALARM_ARM, "123456789012345");

    // Create a specific time
    const time = new Date(Date.UTC(2023, 0, 1, 12, 34, 56)); // 2023-01-01T12:34:56Z

    // Use the protected encodeCommand method to provide a specific time
    const result = (encoder as any).encodeCommand(command, time);

    // Verify the result contains the exact time
    expect(result).toEqual("*HQ,123456789012345,SCF,123456,0,0#");
  });

  // New test to cover line 40 - getUniqueId returns null
  test("should return null when getUniqueId returns null", () => {
    // Create a command
    const command = new Command(Command.TYPE_ALARM_ARM, "123456789012345");

    // Create a mock encoder with a modified getUniqueId method that returns null
    const mockEncoder = new H02ProtocolEncoder();
    // Replace the getUniqueId method to return null
    (mockEncoder as any).getUniqueId = jest.fn().mockReturnValue(null);

    // Use the encodeCommand method
    const time = new Date();
    const result = (mockEncoder as any).encodeCommand(command, time);

    // Verify the result is null
    expect(result).toBeNull();
  });

  // New test to cover line 120 - deviceIds.get returns undefined
  test("should handle case where deviceIds.get returns undefined", () => {
    // Create a mock encoder with a manipulated deviceIds map
    const mockEncoder = new H02ProtocolEncoder();
    // Set up the deviceIds map to return undefined for a specific ID
    (mockEncoder as any).deviceIds = new Map();
    (mockEncoder as any).deviceIds.set("testDevice", undefined);

    // Call getUniqueId directly with the special device ID
    const result = (mockEncoder as any).getUniqueId("testDevice");

    // Verify the result is null
    expect(result).toBeNull();
  });

  // New test to cover line 145 - protocol-specific configuration
  test("should use protocol-specific configuration", () => {
    // Create a config with protocol-specific setting
    const config = { "protocol.alternative.h02": true };
    const configEncoder = new H02ProtocolEncoder(config);

    // Call getConfigValue directly
    const result = (configEncoder as any).getConfigValue(
      "protocol.alternative",
      "someDeviceId"
    );

    // Verify the result is true (from protocol-specific config)
    expect(result).toBe(true);
  });

  // New test to cover line 150 - general configuration
  test("should use general configuration", () => {
    // Create a config with a general setting
    const config = { someConfig: true };
    const configEncoder = new H02ProtocolEncoder(config);

    // Call getConfigValue directly
    const result = (configEncoder as any).getConfigValue(
      "someConfig",
      "someDeviceId"
    );

    // Verify the result is true (from general config)
    expect(result).toBe(true);
  });
});
