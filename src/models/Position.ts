/**
 * Represents a GPS position with various attributes
 */
export class Position {
  // Standard position attributes
  private deviceId: string = "";
  private protocol: string = "";
  private time: Date = new Date();
  private latitude: number = 0;
  private longitude: number = 0;
  private altitude: number = 0;
  private speed: number = 0;
  private course: number = 0;
  private valid: boolean = false;
  private network: any = null;

  // Other attributes
  private readonly attributes: Map<string, any> = new Map();

  // Alarm constants
  public static readonly ALARM_VIBRATION = "vibration";
  public static readonly ALARM_SOS = "sos";
  public static readonly ALARM_OVERSPEED = "overspeed";
  public static readonly ALARM_POWER_CUT = "powerCut";

  // Key constants
  public static readonly KEY_IGNITION = "ignition";
  public static readonly KEY_STATUS = "status";
  public static readonly KEY_RSSI = "rssi";
  public static readonly KEY_SATELLITES = "satellites";
  public static readonly KEY_BATTERY_LEVEL = "batteryLevel";
  public static readonly KEY_STEPS = "steps";
  public static readonly KEY_ODOMETER = "odometer";
  public static readonly KEY_FUEL_LEVEL = "fuelLevel";
  public static readonly KEY_RESULT = "result";
  public static readonly KEY_BATTERY = "battery";
  public static readonly PREFIX_TEMP = "temp";
  public static readonly PREFIX_IO = "io";

  constructor(protocol: string = "") {
    this.protocol = protocol;
  }

  // Getters and setters
  public getDeviceId(): string {
    return this.deviceId;
  }

  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public getProtocol(): string {
    return this.protocol;
  }

  public setProtocol(protocol: string): void {
    this.protocol = protocol;
  }

  public getTime(): Date {
    return this.time;
  }

  public setTime(time: Date): void {
    this.time = time;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  public getAltitude(): number {
    return this.altitude;
  }

  public setAltitude(altitude: number): void {
    this.altitude = altitude;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public getCourse(): number {
    return this.course;
  }

  public setCourse(course: number): void {
    this.course = course;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public setValid(valid: boolean): void {
    this.valid = valid;
  }

  /**
   * Gets the network information
   */
  public getNetwork(): any {
    return this.network;
  }

  /**
   * Sets the network information
   */
  public setNetwork(network: any): void {
    this.network = network;
  }

  /**
   * Set a custom attribute
   */
  public set(key: string, value: any): void {
    this.attributes.set(key, value);
  }

  /**
   * Get a custom attribute
   */
  public get(key: string): any {
    return this.attributes.get(key);
  }

  /**
   * Check if an attribute exists
   */
  public has(key: string): boolean {
    return this.attributes.has(key);
  }

  /**
   * Add an alarm to the position
   */
  public addAlarm(alarmType: string): void {
    const currentAlarms = this.attributes.get("alarms") || [];
    if (!currentAlarms.includes(alarmType)) {
      currentAlarms.push(alarmType);
      this.attributes.set("alarms", currentAlarms);
    }
  }

  /**
   * Get all attributes as an object
   */
  public getAttributes(): Record<string, any> {
    return Object.fromEntries(this.attributes);
  }

  /**
   * Convert position to a plain object
   */
  public toJSON(): Record<string, any> {
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
