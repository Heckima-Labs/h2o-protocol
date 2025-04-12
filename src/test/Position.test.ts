import { Position } from "../models/Position";

describe("Position", () => {
  // Test constructor
  test("should create a position with default values", () => {
    const position = new Position();
    expect(position.getProtocol()).toBe("");
    expect(position.getDeviceId()).toBe("");
    expect(position.getLatitude()).toBe(0);
    expect(position.getLongitude()).toBe(0);
    expect(position.getAltitude()).toBe(0);
    expect(position.getSpeed()).toBe(0);
    expect(position.getCourse()).toBe(0);
    expect(position.isValid()).toBe(false);
    expect(position.getNetwork()).toBeNull();
  });

  test("should create a position with a specific protocol", () => {
    const position = new Position("h02");
    expect(position.getProtocol()).toBe("h02");
  });

  // Test basic getters and setters
  test("should set and get deviceId", () => {
    const position = new Position();
    position.setDeviceId("device123");
    expect(position.getDeviceId()).toBe("device123");
  });

  test("should set and get protocol", () => {
    const position = new Position();
    position.setProtocol("h02");
    expect(position.getProtocol()).toBe("h02");
  });

  test("should set and get time", () => {
    const position = new Position();
    const time = new Date(2023, 5, 15, 10, 30, 0);
    position.setTime(time);
    expect(position.getTime()).toBe(time);
  });

  test("should set and get latitude", () => {
    const position = new Position();
    position.setLatitude(37.7749);
    expect(position.getLatitude()).toBe(37.7749);
  });

  test("should set and get longitude", () => {
    const position = new Position();
    position.setLongitude(-122.4194);
    expect(position.getLongitude()).toBe(-122.4194);
  });

  test("should set and get altitude", () => {
    const position = new Position();
    position.setAltitude(100);
    expect(position.getAltitude()).toBe(100);
  });

  test("should set and get speed", () => {
    const position = new Position();
    position.setSpeed(60);
    expect(position.getSpeed()).toBe(60);
  });

  test("should set and get course", () => {
    const position = new Position();
    position.setCourse(90);
    expect(position.getCourse()).toBe(90);
  });

  test("should set and get valid flag", () => {
    const position = new Position();
    position.setValid(true);
    expect(position.isValid()).toBe(true);
  });

  test("should set and get network information", () => {
    const position = new Position();
    const network = { mcc: 310, mnc: 410, lac: 1234, cid: 5678 };
    position.setNetwork(network);
    expect(position.getNetwork()).toBe(network);
  });

  // Test custom attributes
  test("should set, get, and check custom attributes", () => {
    const position = new Position();

    // Set and get attributes
    position.set("key1", "value1");
    position.set("key2", 42);

    expect(position.get("key1")).toBe("value1");
    expect(position.get("key2")).toBe(42);
    expect(position.get("nonExistent")).toBeUndefined();

    // Check has method
    expect(position.has("key1")).toBe(true);
    expect(position.has("nonExistent")).toBe(false);
  });

  // Test addAlarm
  test("should add an alarm", () => {
    const position = new Position();

    // Add an alarm
    position.addAlarm(Position.ALARM_SOS);

    // Check that it was added
    const alarms = position.get("alarms");
    expect(alarms).toContain(Position.ALARM_SOS);
  });

  // Test adding multiple alarms
  test("should add multiple alarms without duplicates", () => {
    const position = new Position();

    // Add alarms
    position.addAlarm(Position.ALARM_SOS);
    position.addAlarm(Position.ALARM_OVERSPEED);
    position.addAlarm(Position.ALARM_SOS); // Duplicate should be ignored

    // Check that they were added without duplicates
    const alarms = position.get("alarms");
    expect(alarms.length).toBe(2);
    expect(alarms).toContain(Position.ALARM_SOS);
    expect(alarms).toContain(Position.ALARM_OVERSPEED);
  });

  // Test getAttributes
  test("should get all attributes as an object", () => {
    const position = new Position();
    position.set("key1", "value1");
    position.set("key2", 42);

    const attributes = position.getAttributes();
    expect(attributes).toEqual({
      key1: "value1",
      key2: 42,
    });
  });

  // Test toJSON
  test("should convert position to JSON", () => {
    const position = new Position("h02");
    position.setDeviceId("device123");
    const time = new Date(2023, 5, 15, 10, 30, 0);
    position.setTime(time);
    position.setLatitude(37.7749);
    position.setLongitude(-122.4194);
    position.setAltitude(100);
    position.setSpeed(60);
    position.setCourse(90);
    position.setValid(true);
    const network = { mcc: 310, mnc: 410 };
    position.setNetwork(network);
    position.set("key1", "value1");

    const json = position.toJSON();
    expect(json).toEqual({
      deviceId: "device123",
      protocol: "h02",
      time: time.toISOString(),
      latitude: 37.7749,
      longitude: -122.4194,
      altitude: 100,
      speed: 60,
      course: 90,
      valid: true,
      network: network,
      attributes: {
        key1: "value1",
      },
    });
  });

  // Test for the constants
  test("should have the correct alarm constants", () => {
    expect(Position.ALARM_VIBRATION).toBe("vibration");
    expect(Position.ALARM_SOS).toBe("sos");
    expect(Position.ALARM_OVERSPEED).toBe("overspeed");
    expect(Position.ALARM_POWER_CUT).toBe("powerCut");
  });

  test("should have the correct key constants", () => {
    expect(Position.KEY_IGNITION).toBe("ignition");
    expect(Position.KEY_STATUS).toBe("status");
    expect(Position.KEY_RSSI).toBe("rssi");
    expect(Position.KEY_SATELLITES).toBe("satellites");
    expect(Position.KEY_BATTERY_LEVEL).toBe("batteryLevel");
    expect(Position.KEY_STEPS).toBe("steps");
    expect(Position.KEY_ODOMETER).toBe("odometer");
    expect(Position.KEY_FUEL_LEVEL).toBe("fuelLevel");
    expect(Position.KEY_RESULT).toBe("result");
    expect(Position.KEY_BATTERY).toBe("battery");
    expect(Position.PREFIX_TEMP).toBe("temp");
    expect(Position.PREFIX_IO).toBe("io");
  });
});
