/**
 * Represents a command to be sent to a device
 */
export declare class Command {
    static readonly TYPE_ALARM_ARM = "alarmArm";
    static readonly TYPE_ALARM_DISARM = "alarmDisarm";
    static readonly TYPE_ENGINE_STOP = "engineStop";
    static readonly TYPE_ENGINE_RESUME = "engineResume";
    static readonly TYPE_POSITION_PERIODIC = "positionPeriodic";
    static readonly KEY_FREQUENCY = "frequency";
    static readonly KEY_DEVICE_PASSWORD = "devicePassword";
    static readonly KEY_DATA = "data";
    static readonly KEY_ENABLE = "enable";
    static readonly KEY_INDEX = "index";
    static readonly KEY_PHONE = "phone";
    static readonly KEY_SERVER = "server";
    static readonly KEY_PORT = "port";
    private type;
    private deviceId;
    private attributes;
    /**
     * Creates a new command instance
     * @param type The command type
     * @param deviceId The device identifier
     */
    constructor(type: string, deviceId: string);
    /**
     * Gets the command type
     * @returns The command type
     */
    getType(): string;
    /**
     * Sets the command type
     * @param type The command type
     */
    setType(type: string): void;
    /**
     * Gets the device ID
     * @returns The device ID
     */
    getDeviceId(): string;
    /**
     * Sets the device ID
     * @param deviceId The device ID
     */
    setDeviceId(deviceId: string): void;
    /**
     * Sets a command attribute
     * @param key The attribute key
     * @param value The attribute value
     */
    set(key: string, value: any): void;
    /**
     * Gets a command attribute
     * @param key The attribute key
     * @returns The attribute value or undefined if not set
     */
    get(key: string): any;
    /**
     * Checks if an attribute exists
     * @param key The attribute key
     * @returns true if the attribute exists, false otherwise
     */
    has(key: string): boolean;
    /**
     * Gets all attributes as an object
     * @returns An object containing all attributes
     */
    getAttributes(): Record<string, any>;
    /**
     * Converts the command to a plain object
     * @returns A plain object representation of the command
     */
    toJSON(): Record<string, any>;
}
