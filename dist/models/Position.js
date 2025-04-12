"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
/**
 * Represents a GPS position with various attributes
 */
class Position {
    constructor(protocol = "") {
        // Standard position attributes
        this.deviceId = "";
        this.protocol = "";
        this.time = new Date();
        this.latitude = 0;
        this.longitude = 0;
        this.altitude = 0;
        this.speed = 0;
        this.course = 0;
        this.valid = false;
        this.network = null;
        // Other attributes
        this.attributes = new Map();
        this.protocol = protocol;
    }
    // Getters and setters
    getDeviceId() {
        return this.deviceId;
    }
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
    getProtocol() {
        return this.protocol;
    }
    setProtocol(protocol) {
        this.protocol = protocol;
    }
    getTime() {
        return this.time;
    }
    setTime(time) {
        this.time = time;
    }
    getLatitude() {
        return this.latitude;
    }
    setLatitude(latitude) {
        this.latitude = latitude;
    }
    getLongitude() {
        return this.longitude;
    }
    setLongitude(longitude) {
        this.longitude = longitude;
    }
    getAltitude() {
        return this.altitude;
    }
    setAltitude(altitude) {
        this.altitude = altitude;
    }
    getSpeed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    getCourse() {
        return this.course;
    }
    setCourse(course) {
        this.course = course;
    }
    isValid() {
        return this.valid;
    }
    setValid(valid) {
        this.valid = valid;
    }
    /**
     * Gets the network information
     */
    getNetwork() {
        return this.network;
    }
    /**
     * Sets the network information
     */
    setNetwork(network) {
        this.network = network;
    }
    /**
     * Set a custom attribute
     */
    set(key, value) {
        this.attributes.set(key, value);
    }
    /**
     * Get a custom attribute
     */
    get(key) {
        return this.attributes.get(key);
    }
    /**
     * Check if an attribute exists
     */
    has(key) {
        return this.attributes.has(key);
    }
    /**
     * Add an alarm to the position
     */
    addAlarm(alarmType) {
        const currentAlarms = this.attributes.get("alarms") || [];
        if (!currentAlarms.includes(alarmType)) {
            currentAlarms.push(alarmType);
            this.attributes.set("alarms", currentAlarms);
        }
    }
    /**
     * Get all attributes as an object
     */
    getAttributes() {
        return Object.fromEntries(this.attributes);
    }
    /**
     * Convert position to a plain object
     */
    toJSON() {
        return {
            deviceId: this.deviceId,
            protocol: this.protocol,
            time: this.time.toISOString(),
            latitude: this.latitude,
            longitude: this.longitude,
            altitude: this.altitude,
            speed: this.speed,
            course: this.course,
            valid: this.valid,
            network: this.network,
            attributes: this.getAttributes(),
        };
    }
}
exports.Position = Position;
// Alarm constants
Position.ALARM_VIBRATION = "vibration";
Position.ALARM_SOS = "sos";
Position.ALARM_OVERSPEED = "overspeed";
Position.ALARM_POWER_CUT = "powerCut";
// Key constants
Position.KEY_IGNITION = "ignition";
Position.KEY_STATUS = "status";
Position.KEY_RSSI = "rssi";
Position.KEY_SATELLITES = "satellites";
Position.KEY_BATTERY_LEVEL = "batteryLevel";
Position.KEY_STEPS = "steps";
Position.KEY_ODOMETER = "odometer";
Position.KEY_FUEL_LEVEL = "fuelLevel";
Position.KEY_RESULT = "result";
Position.KEY_BATTERY = "battery";
Position.PREFIX_TEMP = "temp";
Position.PREFIX_IO = "io";
//# sourceMappingURL=Position.js.map