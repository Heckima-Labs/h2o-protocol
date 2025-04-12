"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/**
 * Represents a command to be sent to a device
 */
class Command {
    /**
     * Creates a new command instance
     * @param type The command type
     * @param deviceId The device identifier
     */
    constructor(type, deviceId) {
        this.attributes = new Map();
        this.type = type;
        this.deviceId = deviceId;
    }
    /**
     * Gets the command type
     * @returns The command type
     */
    getType() {
        return this.type;
    }
    /**
     * Sets the command type
     * @param type The command type
     */
    setType(type) {
        this.type = type;
    }
    /**
     * Gets the device ID
     * @returns The device ID
     */
    getDeviceId() {
        return this.deviceId;
    }
    /**
     * Sets the device ID
     * @param deviceId The device ID
     */
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
    /**
     * Sets a command attribute
     * @param key The attribute key
     * @param value The attribute value
     */
    set(key, value) {
        this.attributes.set(key, value);
    }
    /**
     * Gets a command attribute
     * @param key The attribute key
     * @returns The attribute value or undefined if not set
     */
    get(key) {
        return this.attributes.get(key);
    }
    /**
     * Checks if an attribute exists
     * @param key The attribute key
     * @returns true if the attribute exists, false otherwise
     */
    has(key) {
        return this.attributes.has(key);
    }
    /**
     * Gets all attributes as an object
     * @returns An object containing all attributes
     */
    getAttributes() {
        return Object.fromEntries(this.attributes);
    }
    /**
     * Converts the command to a plain object
     * @returns A plain object representation of the command
     */
    toJSON() {
        return {
            type: this.type,
            deviceId: this.deviceId,
            attributes: this.getAttributes(),
        };
    }
}
exports.Command = Command;
// Command type constants
Command.TYPE_ALARM_ARM = "alarmArm";
Command.TYPE_ALARM_DISARM = "alarmDisarm";
Command.TYPE_ENGINE_STOP = "engineStop";
Command.TYPE_ENGINE_RESUME = "engineResume";
Command.TYPE_POSITION_PERIODIC = "positionPeriodic";
// Command parameter keys
Command.KEY_FREQUENCY = "frequency";
Command.KEY_DEVICE_PASSWORD = "devicePassword";
Command.KEY_DATA = "data";
Command.KEY_ENABLE = "enable";
Command.KEY_INDEX = "index";
Command.KEY_PHONE = "phone";
Command.KEY_SERVER = "server";
Command.KEY_PORT = "port";
//# sourceMappingURL=Command.js.map