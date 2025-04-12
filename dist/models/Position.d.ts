/**
 * Represents a GPS position with various attributes
 */
export declare class Position {
    private deviceId;
    private protocol;
    private time;
    private latitude;
    private longitude;
    private altitude;
    private speed;
    private course;
    private valid;
    private network;
    private attributes;
    static readonly ALARM_VIBRATION = "vibration";
    static readonly ALARM_SOS = "sos";
    static readonly ALARM_OVERSPEED = "overspeed";
    static readonly ALARM_POWER_CUT = "powerCut";
    static readonly KEY_IGNITION = "ignition";
    static readonly KEY_STATUS = "status";
    static readonly KEY_RSSI = "rssi";
    static readonly KEY_SATELLITES = "satellites";
    static readonly KEY_BATTERY_LEVEL = "batteryLevel";
    static readonly KEY_STEPS = "steps";
    static readonly KEY_ODOMETER = "odometer";
    static readonly KEY_FUEL_LEVEL = "fuelLevel";
    static readonly KEY_RESULT = "result";
    static readonly KEY_BATTERY = "battery";
    static readonly PREFIX_TEMP = "temp";
    static readonly PREFIX_IO = "io";
    constructor(protocol?: string);
    getDeviceId(): string;
    setDeviceId(deviceId: string): void;
    getProtocol(): string;
    setProtocol(protocol: string): void;
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
    /**
     * Gets the network information
     */
    getNetwork(): any;
    /**
     * Sets the network information
     */
    setNetwork(network: any): void;
    /**
     * Set a custom attribute
     */
    set(key: string, value: any): void;
    /**
     * Get a custom attribute
     */
    get(key: string): any;
    /**
     * Check if an attribute exists
     */
    has(key: string): boolean;
    /**
     * Add an alarm to the position
     */
    addAlarm(alarmType: string): void;
    /**
     * Get all attributes as an object
     */
    getAttributes(): Record<string, any>;
    /**
     * Convert position to a plain object
     */
    toJSON(): Record<string, any>;
}
