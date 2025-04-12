# H2O Protocol

A Node.js package for implementing the H2O/H02 protocol used by GPS tracking devices.

## Installation

```bash
npm install h2o-protocol
```

## Features

- Complete implementation of the H2O/H02 protocol
- Support for both binary and text message formats
- Position tracking
- Command encoding and sending
- Support for common GPS tracking device commands
- TCP server for handling device connections
- Lightweight and efficient

## Usage

### Basic Usage

```typescript
import { H02Protocol, Command, Position } from "h2o-protocol";

// Create a protocol instance
const protocol = new H02Protocol({
  port: 5020,
  acknowledgeMessages: true,
});

// Listen for position updates
protocol.on("position", (position: Position) => {
  console.log(`Position received from ${position.getDeviceId()}`);
  console.log(
    `Location: ${position.getLatitude()}, ${position.getLongitude()}`
  );
});

// Start the server
protocol
  .start()
  .then(() => console.log("Server started"))
  .catch((err) => console.error("Failed to start server:", err));
```

### Sending Commands

```typescript
// Create a command to send to a device
const command = new Command(Command.TYPE_POSITION_PERIODIC, "deviceId");
command.set(Command.KEY_FREQUENCY, "60"); // Set position frequency to 60 seconds

// Send the command
protocol
  .sendCommand(command)
  .then(() => console.log("Command sent successfully"))
  .catch((err) => console.error("Failed to send command:", err));
```

### Available Commands

The following commands are supported:

- `TYPE_ALARM_ARM` - Arms the device alarm
- `TYPE_ALARM_DISARM` - Disarms the device alarm
- `TYPE_ENGINE_STOP` - Stops the vehicle engine (if supported by the device)
- `TYPE_ENGINE_RESUME` - Resumes the vehicle engine (if supported by the device)
- `TYPE_POSITION_PERIODIC` - Sets the position reporting frequency

### Events

The protocol instance emits the following events:

- `started` - Server has started
- `stopped` - Server has stopped
- `connection` - New client connection
- `disconnection` - Client disconnection
- `position` - Position update received
- `commandSent` - Command sent successfully
- `error` - Error occurred

## Configuration Options

```typescript
const protocol = new H02Protocol({
  // Port to listen on (default: 5020)
  port: 5020,

  // Whether to enable SSL/TLS (default: false)
  enableSsl: false,

  // The message length for binary messages, 0 for auto-detection (default: 0)
  messageLength: 0,

  // Whether to acknowledge messages (default: true)
  acknowledgeMessages: true,

  // Use alternative commands format for devices that require it
  "protocol.alternative.123456789012345": true,
});
```

## API Reference

### H02Protocol

Main class for handling the H2O/H02 protocol.

```typescript
// Constructor
new H02Protocol(options?: H02ProtocolOptions);

// Methods
start(): Promise<void>;
stop(): Promise<void>;
sendCommand(command: Command): Promise<void>;
getSupportedCommands(): string[];
getName(): string;
```

### Position

Represents a GPS position.

```typescript
// Constructor
new Position(protocol?: string);

// Methods
getDeviceId(): string;
setDeviceId(deviceId: string): void;
getProtocol(): string;
getTime(): Date;
setTime(time: Date): void;
getLatitude(): number;
setLatitude(latitude: number): void;
getLongitude(): number;
setLongitude(longitude: number): void;
getAltitude(): number;
setAltitude(altitude: number): void;
getSpeed(): number;
setSpeed(speed: number): void;
getCourse(): number;
setCourse(course: number): void;
isValid(): boolean;
setValid(valid: boolean): void;
set(key: string, value: any): void;
get(key: string): any;
has(key: string): boolean;
addAlarm(alarmType: string): void;
getAttributes(): Record<string, any>;
toJSON(): Record<string, any>;
```

### Command

Represents a command to be sent to a device.

```typescript
// Constructor
new Command(type: string, deviceId: string);

// Methods
getType(): string;
setType(type: string): void;
getDeviceId(): string;
setDeviceId(deviceId: string): void;
set(key: string, value: any): void;
get(key: string): any;
has(key: string): boolean;
getAttributes(): Record<string, any>;
toJSON(): Record<string, any>;
```

## Example

A full example is available in the `example.ts` file.

## License

Apache License 2.0
