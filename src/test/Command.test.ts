import { Command } from "../models/Command";

describe("Command", () => {
  // Test for constructor and basic getters
  test("should create command with type and deviceId", () => {
    const command = new Command("testType", "device123");
    expect(command.getType()).toBe("testType");
    expect(command.getDeviceId()).toBe("device123");
  });

  // Test for setType
  test("should set command type", () => {
    const command = new Command("initialType", "device123");
    command.setType("newType");
    expect(command.getType()).toBe("newType");
  });

  // Test for setDeviceId
  test("should set device ID", () => {
    const command = new Command("testType", "initialDevice");
    command.setDeviceId("newDevice");
    expect(command.getDeviceId()).toBe("newDevice");
  });

  // Test for set/get/has attributes
  test("should set, get, and check attributes", () => {
    const command = new Command("testType", "device123");

    // Set and get attributes
    command.set("key1", "value1");
    command.set("key2", 42);

    expect(command.get("key1")).toBe("value1");
    expect(command.get("key2")).toBe(42);
    expect(command.get("nonExistent")).toBeUndefined();

    // Check has method
    expect(command.has("key1")).toBe(true);
    expect(command.has("nonExistent")).toBe(false);
  });

  // Test for getAttributes
  test("should get all attributes as object", () => {
    const command = new Command("testType", "device123");
    command.set("key1", "value1");
    command.set("key2", 42);

    const attributes = command.getAttributes();
    expect(attributes).toEqual({
      key1: "value1",
      key2: 42,
    });
  });

  // Test for toJSON
  test("should convert command to JSON", () => {
    const command = new Command("testType", "device123");
    command.set("key1", "value1");
    command.set("key2", 42);

    const json = command.toJSON();
    expect(json).toEqual({
      type: "testType",
      deviceId: "device123",
      attributes: {
        key1: "value1",
        key2: 42,
      },
    });
  });

  // Test for constants
  test("should have the correct constants", () => {
    // Command types
    expect(Command.TYPE_ALARM_ARM).toBe("alarmArm");
    expect(Command.TYPE_ALARM_DISARM).toBe("alarmDisarm");
    expect(Command.TYPE_ENGINE_STOP).toBe("engineStop");
    expect(Command.TYPE_ENGINE_RESUME).toBe("engineResume");
    expect(Command.TYPE_POSITION_PERIODIC).toBe("positionPeriodic");

    // Command parameter keys
    expect(Command.KEY_FREQUENCY).toBe("frequency");
    expect(Command.KEY_DEVICE_PASSWORD).toBe("devicePassword");
    expect(Command.KEY_DATA).toBe("data");
    expect(Command.KEY_ENABLE).toBe("enable");
    expect(Command.KEY_INDEX).toBe("index");
    expect(Command.KEY_PHONE).toBe("phone");
    expect(Command.KEY_SERVER).toBe("server");
    expect(Command.KEY_PORT).toBe("port");
  });
});
