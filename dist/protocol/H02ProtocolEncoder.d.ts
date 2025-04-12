import { Command } from "../models/Command";
/**
 * Protocol encoder for H02 protocol
 */
export declare class H02ProtocolEncoder {
    private static readonly MARKER;
    private protocolName;
    private config;
    private deviceIds;
    /**
     * Creates a new instance of H02ProtocolEncoder
     * @param config Optional configuration
     */
    constructor(config?: Record<string, any>);
    /**
     * Encodes a command to a string
     * @param command The command to encode
     * @returns The encoded command string or null if encoding failed
     */
    encode(command: Command): string | null;
    /**
     * Encodes a command with a specific time
     * @param command The command to encode
     * @param time The time to use in the command
     * @returns The encoded command string or null if encoding failed
     */
    protected encodeCommand(command: Command, time: Date): string | null;
    /**
     * Formats a command with the given parameters
     * @param time The time to include in the command
     * @param uniqueId The device unique ID
     * @param type The command type
     * @param params Additional parameters for the command
     * @returns The formatted command string
     */
    private formatCommand;
    /**
     * Gets the unique ID for a device
     * @param deviceId The device ID
     * @returns The unique ID or null if not found
     */
    private getUniqueId;
    /**
     * Gets a configuration value for a device
     * @param key The configuration key
     * @param deviceId The device ID
     * @returns The configuration value or false if not found
     */
    private getConfigValue;
}
