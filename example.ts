import { H02Protocol, Command, Position } from "./src";

// Create an H02 protocol instance with custom options
const protocol = new H02Protocol({
  port: 5020,
  messageLength: 0, // Auto-detect
  acknowledgeMessages: true,
});

// Event listeners
protocol.on("started", (data) => {
  console.log(`Server started on port ${data.port}`);
});

protocol.on("connection", (data) => {
  console.log(`Client connected: ${data.remoteAddress}`);
});

protocol.on("position", (position: Position) => {
  console.log("Position received:");
  console.log(`  Device ID: ${position.getDeviceId()}`);
  console.log(`  Time: ${position.getTime().toISOString()}`);
  console.log(
    `  Location: ${position.getLatitude()}, ${position.getLongitude()}`
  );
  console.log(`  Speed: ${position.getSpeed()} km/h`);
  console.log(`  Course: ${position.getCourse()}°`);

  // Check if the position has any alarms
  const attributes = position.getAttributes();
  if (attributes.alarms && attributes.alarms.length > 0) {
    console.log(`  Alarms: ${attributes.alarms.join(", ")}`);
  }

  // Example: Send a command to the device that sent the position
  if (position.getSpeed() > 100) {
    // Create a command to send to the device
    const command = new Command(Command.TYPE_ALARM_ARM, position.getDeviceId());

    protocol
      .sendCommand(command)
      .then(() => {
        console.log("Alarm arm command sent successfully");
      })
      .catch((err) => {
        console.error("Failed to send command:", err);
      });
  }
});

protocol.on("error", (error) => {
  console.error("Protocol error:", error);
});

// Start the server
protocol
  .start()
  .then(() => {
    console.log("Server started!");
    console.log("Waiting for connections...");
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

// Handle process termination
process.on("SIGINT", () => {
  console.log("Stopping server...");
  protocol
    .stop()
    .then(() => {
      console.log("Server stopped!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to stop server:", err);
      process.exit(1);
    });
});
