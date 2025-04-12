import { EventEmitter } from "events";
import { Socket, Server, createServer } from "net";
import { H02FrameDecoder } from "./H02FrameDecoder";
import { H02ProtocolDecoder } from "./H02ProtocolDecoder";
import { H02ProtocolEncoder } from "./H02ProtocolEncoder";
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
export class H02Protocol extends EventEmitter {
  private readonly options: H02ProtocolOptions;
  private server: Server | null = null;
  private readonly clients: Map<string, Socket> = new Map();
  private readonly frameDecoder: H02FrameDecoder;
  private readonly protocolDecoder: H02ProtocolDecoder;
  private readonly protocolEncoder: H02ProtocolEncoder;

  /**
   * Creates a new instance of the H02 protocol
   * @param options Configuration options
   */
  constructor(options: H02ProtocolOptions = {}) {
    super();

    // Set default options
    this.options = {
      port: 5020,
      enableSsl: false,
      messageLength: 0,
      acknowledgeMessages: true,
      ...options,
    };

    // Initialize components
    this.frameDecoder = new H02FrameDecoder(this.options.messageLength);
    this.protocolDecoder = new H02ProtocolDecoder(this.options);
    this.protocolEncoder = new H02ProtocolEncoder(this.options);
  }

  /**
   * Starts the server
   * @returns A promise that resolves when the server is started
   */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        reject(new Error("Server already started"));
        return;
      }

      this.server = createServer((socket) => this.handleConnection(socket));

      this.server.on("error", (err) => {
        this.emit("error", err);
        reject(err);
      });

      this.server.listen(this.options.port, () => {
        this.emit("started", { port: this.options.port });
        resolve();
      });
    });
  }

  /**
   * Stops the server
   * @returns A promise that resolves when the server is stopped
   */
  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      // Close all client connections
      for (const socket of this.clients.values()) {
        socket.destroy();
      }
      this.clients.clear();

      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.server = null;
          this.emit("stopped");
          resolve();
        }
      });
    });
  }

  /**
   * Sends a command to a device
   * @param command The command to send
   * @returns A promise that resolves when the command is sent
   */
  public sendCommand(command: Command): Promise<void> {
    return new Promise((resolve, reject) => {
      const deviceId = command.getDeviceId();
      const socket = this.clients.get(deviceId);

      if (!socket) {
        reject(new Error(`Device not connected: ${deviceId}`));
        return;
      }

      const data = this.protocolEncoder.encode(command);
      if (!data) {
        reject(new Error(`Failed to encode command: ${command.getType()}`));
        return;
      }

      socket.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          this.emit("commandSent", { deviceId, command });
          resolve();
        }
      });
    });
  }

  /**
   * Handles a new client connection
   * @param socket The client socket
   */
  private handleConnection(socket: Socket): void {
    const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    this.emit("connection", { remoteAddress });

    let buffer = Buffer.alloc(0);
    let deviceId: string | null = null;

    socket.on("data", (data) => {
      // Append data to buffer
      buffer = Buffer.concat([buffer, data]);

      // Process all complete frames in the buffer
      let frame: Buffer | null;
      while ((frame = this.frameDecoder.decode(buffer)) !== null) {
        // Update the buffer (remove the processed frame)
        buffer = buffer.subarray(frame.length);

        // Decode the frame
        const position = this.protocolDecoder.decode(frame, remoteAddress);
        if (position) {
          deviceId = position.getDeviceId();

          // Store the socket by device ID for sending commands
          if (deviceId && !this.clients.has(deviceId)) {
            this.clients.set(deviceId, socket);
          }

          // Emit position event
          this.emit("position", position);

          // Send acknowledgement if required
          if (this.options.acknowledgeMessages) {
            this.sendAcknowledgement(socket, frame, deviceId);
          }
        }
      }
    });

    socket.on("close", () => {
      this.emit("disconnection", { remoteAddress, deviceId });

      // Remove the socket from the clients map
      if (deviceId) {
        this.clients.delete(deviceId);
      }
    });

    socket.on("error", (err) => {
      this.emit("error", { remoteAddress, deviceId, error: err });
    });
  }

  /**
   * Sends an acknowledgement for a received message
   * @param socket The client socket
   * @param frame The received frame
   * @param deviceId The device ID
   */
  private sendAcknowledgement(
    socket: Socket,
    frame: Buffer,
    deviceId: string | null
  ): void {
    // Only acknowledge text messages that start with '*'
    if (frame[0] !== 0x2a) {
      // '*' in ASCII
      return;
    }

    const frameStr = frame.toString("ascii");
    const parts = frameStr.split(",");

    if (parts.length < 3) {
      return;
    }

    // Check message type for acknowledgement
    const type = parts[2];

    let response = "";

    if (type === "V1") {
      // V1 acknowledgement
      response = `*${parts[0].substring(1)},${parts[1]},V1#`;
    } else {
      // Default acknowledgement (R12)
      const now = new Date();
      const hours = now.getUTCHours().toString().padStart(2, "0");
      const minutes = now.getUTCMinutes().toString().padStart(2, "0");
      const seconds = now.getUTCSeconds().toString().padStart(2, "0");
      const timeStr = `${hours}${minutes}${seconds}`;

      response = `*${parts[0].substring(1)},${parts[1]},R12,${timeStr}#`;
    }

    socket.write(response, (err) => {
      if (err) {
        this.emit("error", {
          message: "Failed to send acknowledgement",
          deviceId,
          error: err,
        });
      }
    });
  }

  /**
   * Gets the supported command types
   * @returns Array of supported command types
   */
  public getSupportedCommands(): string[] {
    return [
      Command.TYPE_ALARM_ARM,
      Command.TYPE_ALARM_DISARM,
      Command.TYPE_ENGINE_STOP,
      Command.TYPE_ENGINE_RESUME,
      Command.TYPE_POSITION_PERIODIC,
    ];
  }

  /**
   * Gets the protocol name
   * @returns The protocol name
   */
  public getName(): string {
    return "h02";
  }
}
