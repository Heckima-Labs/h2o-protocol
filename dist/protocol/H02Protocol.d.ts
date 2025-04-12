import { EventEmitter } from "events";
import { Command } from "../models/Command";
/**
 * Configuration options for the H02 protocol
 */
export interface H02ProtocolOptions {
    /**
     * The port to listen on for TCP connections
     */
    port?: number;
    /**
     * Whether to enable SSL/TLS
     */
    enableSsl?: boolean;
    /**
     * The message length for binary messages (0 for auto-detection)
     */
    messageLength?: number;
    /**
     * Whether to acknowledge messages
     */
    acknowledgeMessages?: boolean;
    /**
     * Additional configuration options
     */
    [key: string]: any;
}
/**
 * Implementation of the H02 GPS tracking protocol
 */
export declare class H02Protocol extends EventEmitter {
    private options;
    private server;
    private clients;
    private frameDecoder;
    private protocolDecoder;
    private protocolEncoder;
    /**
     * Creates a new instance of the H02 protocol
     * @param options Configuration options
     */
    constructor(options?: H02ProtocolOptions);
    /**
     * Starts the server
     * @returns A promise that resolves when the server is started
     */
    start(): Promise<void>;
    /**
     * Stops the server
     * @returns A promise that resolves when the server is stopped
     */
    stop(): Promise<void>;
    /**
     * Sends a command to a device
     * @param command The command to send
     * @returns A promise that resolves when the command is sent
     */
    sendCommand(command: Command): Promise<void>;
    /**
     * Handles a new client connection
     * @param socket The client socket
     */
    private handleConnection;
    /**
     * Sends an acknowledgement for a received message
     * @param socket The client socket
     * @param frame The received frame
     * @param deviceId The device ID
     */
    private sendAcknowledgement;
    /**
     * Gets the supported command types
     * @returns Array of supported command types
     */
    getSupportedCommands(): string[];
    /**
     * Gets the protocol name
     * @returns The protocol name
     */
    getName(): string;
}
