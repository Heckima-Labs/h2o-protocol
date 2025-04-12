/**
 * Represents network information for the device
 */
export class Network {
  private readonly cellTowers: CellTower[] = [];

  /**
   * Adds a cell tower to the network
   * @param cellTower The cell tower to add
   */
  public addCellTower(cellTower: CellTower): void {
    this.cellTowers.push(cellTower);
  }

  /**
   * Gets all cell towers
   * @returns Array of cell towers
   */
  public getCellTowers(): CellTower[] {
    return [...this.cellTowers];
  }

  /**
   * Converts the network to a plain object
   * @returns A plain object representation of the network
   */
  public toJSON(): Record<string, any> {
    return {
      cellTowers: this.cellTowers.map((tower) => tower.toJSON()),
    };
  }
}

/**
 * Represents a cell tower
 */
export class CellTower {
  private readonly mobileCountryCode: number;
  private readonly mobileNetworkCode: number;
  private readonly locationAreaCode: number;
  private readonly cellId: number;
  private readonly signalStrength?: number;

  /**
   * Creates a new cell tower instance
   * @param mcc Mobile Country Code
   * @param mnc Mobile Network Code
   * @param lac Location Area Code
   * @param cid Cell ID
   * @param signalStrength Signal strength (optional)
   */
  constructor(
    mcc: number,
    mnc: number,
    lac: number,
    cid: number,
    signalStrength?: number
  ) {
    this.mobileCountryCode = mcc;
    this.mobileNetworkCode = mnc;
    this.locationAreaCode = lac;
    this.cellId = cid;
    this.signalStrength = signalStrength;
  }

  /**
   * Creates a cell tower from MCC, MNC and LAC-CID
   * @param mcc Mobile Country Code
   * @param mnc Mobile Network Code
   * @param lac Location Area Code
   * @param cid Cell ID
   * @param signalStrength Signal strength (optional)
   * @returns A new CellTower instance
   */
  public static from(
    mcc: number,
    mnc: number,
    lac: number,
    cid: number,
    signalStrength?: number
  ): CellTower {
    return new CellTower(mcc, mnc, lac, cid, signalStrength);
  }

  /**
   * Creates a cell tower from LAC-CID, using the provided MCC and MNC or defaults
   * @param lac Location Area Code
   * @param cid Cell ID
   * @param config Optional configuration for default MCC and MNC
   * @returns A new CellTower instance
   */
  public static fromLacCid(
    lac: number,
    cid: number,
    config?: { mcc?: number; mnc?: number }
  ): CellTower {
    const mcc = config?.mcc ?? 0;
    const mnc = config?.mnc ?? 0;
    return new CellTower(mcc, mnc, lac, cid);
  }

  /**
   * Gets the Mobile Country Code
   * @returns The Mobile Country Code
   */
  public getMobileCountryCode(): number {
    return this.mobileCountryCode;
  }

  /**
   * Gets the Mobile Network Code
   * @returns The Mobile Network Code
   */
  public getMobileNetworkCode(): number {
    return this.mobileNetworkCode;
  }

  /**
   * Gets the Location Area Code
   * @returns The Location Area Code
   */
  public getLocationAreaCode(): number {
    return this.locationAreaCode;
  }

  /**
   * Gets the Cell ID
   * @returns The Cell ID
   */
  public getCellId(): number {
    return this.cellId;
  }

  /**
   * Gets the signal strength
   * @returns The signal strength or undefined if not available
   */
  public getSignalStrength(): number | undefined {
    return this.signalStrength;
  }

  /**
   * Converts the cell tower to a plain object
   * @returns A plain object representation of the cell tower
   */
  public toJSON(): Record<string, any> {
    const result: Record<string, any> = {
      mobileCountryCode: this.mobileCountryCode,
      mobileNetworkCode: this.mobileNetworkCode,
      locationAreaCode: this.locationAreaCode,
      cellId: this.cellId,
    };

    if (this.signalStrength !== undefined) {
      result.signalStrength = this.signalStrength;
    }

    return result;
  }
}
