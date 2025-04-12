import { Command } from "../models/Command";

/**
 * Protocol encoder for H02 protocol
 */
export class H02ProtocolEncoder {
  private static readonly MARKER = "HQ";
  private readonly protocolName: string = "h02";
  private readonly config: Record<string, any> = {};
  private readonly deviceIds: Map<string, string> = new Map();

  /**
   * Creates a new instance of H02ProtocolEncoder
   * @param config Optional configuration
   */
  constructor(config: Record<string, any> = {}) {
    this.config = config;
  }

  /**
   * Encodes a command to a string
   * @param command The command to encode
   * @returns The encoded command string or null if encoding failed
   */
  public encode(command: Command): string | null {
    // Get current time for the command
    const time = new Date();
    return this.encodeCommand(command, time);
  }

  /**
   * Encodes a command with a specific time
   * @param command The command to encode
   * @param time The time to use in the command
   * @returns The encoded command string or null if encoding failed
   */
  protected encodeCommand(command: Command, time: Date): string | null {
    const uniqueId = this.getUniqueId(command.getDeviceId());
    if (!uniqueId) {
      return null;
    }

    const type = command.getType();

    switch (type) {
      case Command.TYPE_ALARM_ARM:
        return this.formatCommand(time, uniqueId, "SCF", "0", "0");

      case Command.TYPE_ALARM_DISARM:
        return this.formatCommand(time, uniqueId, "SCF", "1", "1");

      case Command.TYPE_ENGINE_STOP:
        return this.formatCommand(time, uniqueId, "S20", "1", "1");

      case Command.TYPE_ENGINE_RESUME:
        return this.formatCommand(time, uniqueId, "S20", "1", "0");

      case Command.TYPE_POSITION_PERIODIC: {
        const frequency = command.get(Command.KEY_FREQUENCY)?.toString();
        if (!frequency) {
          return null;
        }

        if (
          this.getConfigValue("protocol.alternative", command.getDeviceId())
        ) {
          return this.formatCommand(time, uniqueId, "D1", frequency);
        } else {
          return this.formatCommand(time, uniqueId, "S71", "22", frequency);
        }
      }

      default:
        return null;
    }
  }

  /**
   * Formats a command with the given parameters
   * @param time The time to include in the command
   * @param uniqueId The device unique ID
   * @param type The command type
   * @param params Additional parameters for the command
   * @returns The formatted command string
   */
  private formatCommand(
    time: Date,
    uniqueId: string,
    type: string,
    ...params: string[]
  ): string {
    // Format the time as HHmmss
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    const seconds = time.getUTCSeconds().toString().padStart(2, "0");
    const timeStr = `${hours}${minutes}${seconds}`;

    // Build the command string
    let result = `*${H02ProtocolEncoder.MARKER},${uniqueId},${type},${timeStr}`;

    // Add additional parameters
    for (const param of params) {
      result += `,${param}`;
    }

    // Add the closing character
    result += "#";

    return result;
  }

  /**
   * Gets the unique ID for a device
   * @param deviceId The device ID
   * @returns The unique ID or null if not found
   */
  private getUniqueId(deviceId: string): string | null {
    // Lookup the device unique ID from the map
    if (this.deviceIds.has(deviceId)) {
      return this.deviceIds.get(deviceId) ?? null;
    }

    // For testing/demo purposes, use the deviceId as the uniqueId
    // In a real implementation, this would lookup from a database
    this.deviceIds.set(deviceId, deviceId);
    return deviceId;
  }

  /**
   * Gets a configuration value for a device
   * @param key The configuration key
   * @param deviceId The device ID
   * @returns The configuration value or false if not found
   */
  private getConfigValue(key: string, deviceId: string): boolean {
    // Check for device-specific configuration
    const deviceKey = `${key}.${deviceId}`;
    if (deviceKey in this.config) {
      return Boolean(this.config[deviceKey]);
    }

    // Check for protocol-specific configuration
    const protocolKey = `${key}.${this.protocolName}`;
    if (protocolKey in this.config) {
      return Boolean(this.config[protocolKey]);
    }

    // Check for general configuration
    if (key in this.config) {
      return Boolean(this.config[key]);
    }

    // Default to false
    return false;
  }
}
