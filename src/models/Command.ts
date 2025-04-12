/**
 * Represents a command to be sent to a device
 */
export class Command {
  // Command type constants
  public static readonly TYPE_ALARM_ARM = "alarmArm";
  public static readonly TYPE_ALARM_DISARM = "alarmDisarm";
  public static readonly TYPE_ENGINE_STOP = "engineStop";
  public static readonly TYPE_ENGINE_RESUME = "engineResume";
  public static readonly TYPE_POSITION_PERIODIC = "positionPeriodic";

  // Command parameter keys
  public static readonly KEY_FREQUENCY = "frequency";
  public static readonly KEY_DEVICE_PASSWORD = "devicePassword";
  public static readonly KEY_DATA = "data";
  public static readonly KEY_ENABLE = "enable";
  public static readonly KEY_INDEX = "index";
  public static readonly KEY_PHONE = "phone";
  public static readonly KEY_SERVER = "server";
  public static readonly KEY_PORT = "port";

  private type: string;
  private deviceId: string;
  private readonly attributes: Map<string, any> = new Map();

  /**
   * Creates a new command instance
   * @param type The command type
   * @param deviceId The device identifier
   */
  constructor(type: string, deviceId: string) {
    this.type = type;
    this.deviceId = deviceId;
  }

  /**
   * Gets the command type
   * @returns The command type
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Sets the command type
   * @param type The command type
   */
  public setType(type: string): void {
    this.type = type;
  }

  /**
   * Gets the device ID
   * @returns The device ID
   */
  public getDeviceId(): string {
    return this.deviceId;
  }

  /**
   * Sets the device ID
   * @param deviceId The device ID
   */
  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  /**
   * Sets a command attribute
   * @param key The attribute key
   * @param value The attribute value
   */
  public set(key: string, value: any): void {
    this.attributes.set(key, value);
  }

  /**
   * Gets a command attribute
   * @param key The attribute key
   * @returns The attribute value or undefined if not set
   */
  public get(key: string): any {
    return this.attributes.get(key);
  }

  /**
   * Checks if an attribute exists
   * @param key The attribute key
   * @returns true if the attribute exists, false otherwise
   */
  public has(key: string): boolean {
    return this.attributes.has(key);
  }

  /**
   * Gets all attributes as an object
   * @returns An object containing all attributes
   */
  public getAttributes(): Record<string, any> {
    return Object.fromEntries(this.attributes);
  }

  /**
   * Converts the command to a plain object
   * @returns A plain object representation of the command
   */
  public toJSON(): Record<string, any> {
    return {
      type: this.type,
      deviceId: this.deviceId,
      attributes: this.getAttributes(),
    };
  }
}
