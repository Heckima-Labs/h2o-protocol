import { EventEmitter } from "events";
import { createServer } from "net";
import { H02Protocol, H02ProtocolOptions } from "../protocol/H02Protocol";
import { H02FrameDecoder } from "../protocol/H02FrameDecoder";
import { H02ProtocolDecoder } from "../protocol/H02ProtocolDecoder";
import { H02ProtocolEncoder } from "../protocol/H02ProtocolEncoder";
import { Command } from "../models/Command";
import { Position } from "../models/Position";

// Mock dependencies
jest.mock("net", () => {
  const mockSocket = {
    remoteAddress: "127.0.0.1",
    remotePort: 12345,
    on: jest.fn(),
    write: jest.fn((data, callback) => callback()),
    destroy: jest.fn(),
  };

  const mockServer = {
    on: jest.fn(),
    listen: jest.fn((port, callback) => callback()),
    close: jest.fn((callback) => callback()),
  };

  return {
    Socket: jest.fn(() => mockSocket),
    Server: jest.fn(() => mockServer),
    createServer: jest.fn((handler) => {
      const server = mockServer;
      // Store the connection handler for later use in tests
      (server as any).connectionHandler = handler;
      return server;
    }),
  };
});

// Mock protocol components
jest.mock("../protocol/H02FrameDecoder", () => {
  return {
    H02FrameDecoder: jest.fn().mockImplementation(() => ({
      decode: jest.fn(),
    })),
  };
});

jest.mock("../protocol/H02ProtocolDecoder", () => {
  return {
    H02ProtocolDecoder: jest.fn().mockImplementation(() => ({
      decode: jest.fn(),
    })),
  };
});

jest.mock("../protocol/H02ProtocolEncoder", () => {
  return {
    H02ProtocolEncoder: jest.fn().mockImplementation(() => ({
      encode: jest.fn(),
    })),
  };
});

describe("H02Protocol", () => {
  let protocol: H02Protocol;
  let mockServer: any;
  let mockSocket: any;
  let mockFrameDecoder: any;
  let mockProtocolDecoder: any;
  let mockProtocolEncoder: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Initialize mocks
    mockSocket = {
      remoteAddress: "127.0.0.1",
      remotePort: 12345,
      on: jest.fn(),
      write: jest.fn((data, callback) => callback && callback()),
      destroy: jest.fn(),
    };

    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, callback) => callback()),
      close: jest.fn((callback) => callback()),
      connectionHandler: null,
    };

    // Setup mocked createServer
    (createServer as jest.Mock).mockImplementation((handler) => {
      mockServer.connectionHandler = handler;
      return mockServer;
    });

    // Setup decoder/encoder mocks
    mockFrameDecoder = {
      decode: jest.fn(),
    };
    mockProtocolDecoder = {
      decode: jest.fn(),
    };
    mockProtocolEncoder = {
      encode: jest.fn(),
    };

    // Set mock implementations for the imported classes
    (H02FrameDecoder as unknown as jest.Mock).mockImplementation(
      () => mockFrameDecoder
    );
    (H02ProtocolDecoder as unknown as jest.Mock).mockImplementation(
      () => mockProtocolDecoder
    );
    (H02ProtocolEncoder as unknown as jest.Mock).mockImplementation(
      () => mockProtocolEncoder
    );

    // Create protocol instance
    const options: H02ProtocolOptions = {
      port: 5020,
      acknowledgeMessages: true,
    };
    protocol = new H02Protocol(options);
  });

  test("constructor should initialize with default options", () => {
    expect(H02FrameDecoder).toHaveBeenCalledWith(0);
    expect(H02ProtocolDecoder).toHaveBeenCalled();
    expect(H02ProtocolEncoder).toHaveBeenCalled();
  });

  test("constructor should initialize with custom options", () => {
    expect(H02FrameDecoder).toHaveBeenCalledWith(32);
  });

  test("start should create server and listen on port", async () => {
    const emitSpy = jest.spyOn(protocol, "emit");

    await protocol.start();

    expect(createServer).toHaveBeenCalled();
    expect(mockServer.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mockServer.listen).toHaveBeenCalledWith(5020, expect.any(Function));
    expect(emitSpy).toHaveBeenCalledWith("started", { port: 5020 });
  });

  test("start should reject if server is already started", async () => {
    // Start server once
    await protocol.start();

    // Try to start it again
    await expect(protocol.start()).rejects.toThrow("Server already started");
  });

  test("stop should close server and client connections", async () => {
    const emitSpy = jest.spyOn(protocol, "emit");

    // Start server first
    await protocol.start();

    // Add a mock client
    const clientsMap = new Map();
    clientsMap.set("device123", mockSocket);
    (protocol as any).clients = clientsMap;

    // Stop server
    await protocol.stop();

    expect(mockSocket.destroy).toHaveBeenCalled();
    expect(mockServer.close).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith("stopped");
  });

  test("stop should resolve if server is not running", async () => {
    await expect(protocol.stop()).resolves.not.toThrow();
  });

  test("sendCommand should send data to connected client", async () => {
    const command = new Command(Command.TYPE_ALARM_ARM, "device123");
    const emitSpy = jest.spyOn(protocol, "emit");

    // Add a mock client
    const clientsMap = new Map();
    clientsMap.set("device123", mockSocket);
    (protocol as any).clients = clientsMap;

    // Setup encoder
    mockProtocolEncoder.encode.mockReturnValue("*HQ,device123,SCF,123456,0,0#");

    await protocol.sendCommand(command);

    expect(mockProtocolEncoder.encode).toHaveBeenCalledWith(command);
    expect(mockSocket.write).toHaveBeenCalledWith(
      "*HQ,device123,SCF,123456,0,0#",
      expect.any(Function)
    );
    expect(emitSpy).toHaveBeenCalledWith("commandSent", {
      deviceId: "device123",
      command,
    });
  });

  test("sendCommand should reject if device is not connected", async () => {
    const command = new Command(Command.TYPE_ALARM_ARM, "device123");

    await expect(protocol.sendCommand(command)).rejects.toThrow(
      "Device not connected: device123"
    );
  });

  test("sendCommand should reject if encoding fails", async () => {
    const command = new Command(Command.TYPE_ALARM_ARM, "device123");

    // Add a mock client
    const clientsMap = new Map();
    clientsMap.set("device123", mockSocket);
    (protocol as any).clients = clientsMap;

    // Setup encoder to return null (encoding failure)
    mockProtocolEncoder.encode.mockReturnValue(null);

    await expect(protocol.sendCommand(command)).rejects.toThrow(
      "Failed to encode command: alarmArm"
    );
  });

  test("handleConnection should process data and emit events", () => {
    const emitSpy = jest.spyOn(protocol, "emit");

    // Start server to initialize connection handler
    protocol.start();

    // Simulate server connection
    mockServer.connectionHandler(mockSocket);

    // Extract the data handler
    const dataHandler = mockSocket.on.mock.calls.find(
      (call: any) => call[0] === "data"
    )[1];

    // Prepare mock data
    const mockPosition = new Position();
    mockPosition.setDeviceId("device123");

    // Setup decoder mocks with proper Buffer return value
    const mockFrame = Buffer.from(
      "*HQ,device123,V1,123456,A,1234.5678,N,12345.6789,E,10.5,120,010120,FFFFFBFF#"
    );
    mockFrameDecoder.decode
      .mockReturnValueOnce(mockFrame)
      .mockReturnValue(null);
    mockProtocolDecoder.decode.mockReturnValueOnce(mockPosition);

    // Trigger data handler
    dataHandler(Buffer.from("some data"));

    expect(mockFrameDecoder.decode).toHaveBeenCalled();
    expect(mockProtocolDecoder.decode).toHaveBeenCalledWith(
      mockFrame,
      "127.0.0.1:12345"
    );
    expect(emitSpy).toHaveBeenCalledWith("connection", {
      remoteAddress: "127.0.0.1:12345",
    });
    expect(emitSpy).toHaveBeenCalledWith("position", mockPosition);
  });

  test("handleConnection should handle close event", () => {
    const emitSpy = jest.spyOn(protocol, "emit");

    // Start server
    protocol.start();

    // Simulate connection
    mockServer.connectionHandler(mockSocket);

    // Extract the close handler
    const closeHandler = mockSocket.on.mock.calls.find(
      (call: any) => call[0] === "close"
    )[1];

    // Set device ID in the connection
    const clientsMap = new Map();
    clientsMap.set("device123", mockSocket);
    (protocol as any).clients = clientsMap;

    // Trigger close handler
    closeHandler();

    expect(emitSpy).toHaveBeenCalledWith("disconnection", {
      remoteAddress: "127.0.0.1:12345",
      deviceId: null,
    });
  });

  test("handleConnection should handle error event", () => {
    // Spy on emit but suppress errors
    const emitSpy = jest
      .spyOn(protocol, "emit")
      .mockImplementation((event, ...args) => {
        // Don't actually propagate the 'error' event to prevent Jest from failing the test
        if (event !== "error") {
          return EventEmitter.prototype.emit.call(protocol, event, ...args);
        }
        return true;
      });

    // Start server
    protocol.start();

    // Simulate connection
    mockServer.connectionHandler(mockSocket);

    // Extract the error handler
    const errorHandler = mockSocket.on.mock.calls.find(
      (call: any) => call[0] === "error"
    )[1];

    // Trigger error handler
    const error = new Error("Connection error");
    errorHandler(error);

    expect(emitSpy).toHaveBeenCalledWith("error", {
      remoteAddress: "127.0.0.1:12345",
      deviceId: null,
      error,
    });

    // Restore the original emit
    emitSpy.mockRestore();
  });

  test("getSupportedCommands should return supported commands", () => {
    const commands = protocol.getSupportedCommands();

    expect(commands).toContain(Command.TYPE_ALARM_ARM);
    expect(commands).toContain(Command.TYPE_ALARM_DISARM);
    expect(commands).toContain(Command.TYPE_ENGINE_STOP);
    expect(commands).toContain(Command.TYPE_ENGINE_RESUME);
    expect(commands).toContain(Command.TYPE_POSITION_PERIODIC);
  });

  test("getName should return protocol name", () => {
    expect(protocol.getName()).toBe("h02");
  });

  test("sendAcknowledgement should send V1 acknowledgement", () => {
    // Start server
    protocol.start();

    // Create a text frame for acknowledgement
    const frame = Buffer.from(
      "*HQ,123456789012345,V1,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF#"
    );

    // Call the private method
    (protocol as any).sendAcknowledgement(mockSocket, frame, "device123");

    expect(mockSocket.write).toHaveBeenCalledWith(
      "*HQ,123456789012345,V1#",
      expect.any(Function)
    );
  });

  test("sendAcknowledgement should send R12 acknowledgement for other types", () => {
    // Mock Date.now() to have consistent time
    const originalDate = global.Date;
    const mockDate = class extends Date {
      getUTCHours() {
        return 12;
      }
      getUTCMinutes() {
        return 34;
      }
      getUTCSeconds() {
        return 56;
      }
    };
    global.Date = mockDate as DateConstructor;

    // Start server
    protocol.start();

    // Create a text frame for acknowledgement (non-V1 type)
    const frame = Buffer.from(
      "*HQ,123456789012345,NBR,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF#"
    );

    // Call the private method
    (protocol as any).sendAcknowledgement(mockSocket, frame, "device123");

    expect(mockSocket.write).toHaveBeenCalledWith(
      "*HQ,123456789012345,R12,123456#",
      expect.any(Function)
    );

    // Restore Date
    global.Date = originalDate;
  });

  test("sendAcknowledgement should skip binary messages", () => {
    // Start server
    protocol.start();

    // Create a binary frame (starts with $ instead of *)
    const frame = Buffer.from("$binary_data");

    // Call the private method
    (protocol as any).sendAcknowledgement(mockSocket, frame, "device123");

    expect(mockSocket.write).not.toHaveBeenCalled();
  });

  test("sendAcknowledgement should handle write errors", () => {
    // Spy on emit but suppress errors
    const emitSpy = jest
      .spyOn(protocol, "emit")
      .mockImplementation((event, ...args) => {
        // Don't actually propagate the 'error' event to prevent Jest from failing the test
        if (event !== "error") {
          return EventEmitter.prototype.emit.call(protocol, event, ...args);
        }
        return true;
      });

    // Start server
    protocol.start();

    // Create a text frame for acknowledgement
    const frame = Buffer.from(
      "*HQ,123456789012345,V1,123519,A,5123.2350,N,00132.4979,E,0.00,0,100917,FFFFFBFF#"
    );

    // Mock socket to trigger an error
    const errorSocket = {
      ...mockSocket,
      write: jest.fn(
        (data, callback) => callback && callback(new Error("Write failed"))
      ),
    };

    // Call the private method
    (protocol as any).sendAcknowledgement(errorSocket, frame, "device123");

    expect(emitSpy).toHaveBeenCalledWith("error", {
      message: "Failed to send acknowledgement",
      deviceId: "device123",
      error: expect.any(Error),
    });

    // Restore the original emit
    emitSpy.mockRestore();
  });
});
