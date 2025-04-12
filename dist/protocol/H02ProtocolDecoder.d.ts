import { Position } from "../models/Position";
/**
 * Protocol decoder for H02 protocol
 */
export declare class H02ProtocolDecoder {
    private protocolName;
    private config;
    private deviceSessions;
    /**
     * Creates a new instance of H02ProtocolDecoder
     * @param config Optional configuration
     */
    constructor(config?: Record<string, any>);
    /**
     * Decodes buffer data to a Position object
     * @param buffer The buffer data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    decode(buffer: Buffer, remoteAddress?: string): Position | null;
    /**
     * Decodes binary data to a Position object
     * @param buf The buffer data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    private decodeBinary;
    /**
     * Decodes text data to a Position object
     * @param sentence The text data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    private decodeText;
    /**
     * Decode standard position message
     */
    private decodeRegular;
    /**
     * Decode V1 message (response to command)
     */
    private decodeV1;
    /**
     * Decode V4 message (response to command)
     */
    private decodeV4;
    /**
     * Decode NBR message (cell towers)
     */
    private decodeNBR;
    /**
     * Decode LINK message (device status)
     */
    private decodeLink;
    /**
     * Decode V3 message (cell towers)
     */
    private decodeV3;
    /**
     * Decode VP1 message (GPS or cell towers)
     */
    private decodeVP1;
    /**
     * Decode heartbeat message (HTBT)
     */
    private decodeHeartbeat;
    /**
     * Process device status
     */
    private processStatus;
    /**
     * Decode battery level
     */
    private decodeBattery;
    /**
     * Read coordinate from buffer
     */
    private readCoordinate;
    /**
     * Get the device ID from the device identifier and remote address
     */
    private getDeviceId;
    /**
     * Get the last known location or create one with the provided time
     */
    private getLastLocation;
}
