/**
 * Represents network information for the device
 */
export declare class Network {
    private cellTowers;
    /**
     * Adds a cell tower to the network
     * @param cellTower The cell tower to add
     */
    addCellTower(cellTower: CellTower): void;
    /**
     * Gets all cell towers
     * @returns Array of cell towers
     */
    getCellTowers(): CellTower[];
    /**
     * Converts the network to a plain object
     * @returns A plain object representation of the network
     */
    toJSON(): Record<string, any>;
}
/**
 * Represents a cell tower
 */
export declare class CellTower {
    private mobileCountryCode;
    private mobileNetworkCode;
    private locationAreaCode;
    private cellId;
    private signalStrength?;
    /**
     * Creates a new cell tower instance
     * @param mcc Mobile Country Code
     * @param mnc Mobile Network Code
     * @param lac Location Area Code
     * @param cid Cell ID
     * @param signalStrength Signal strength (optional)
     */
    constructor(mcc: number, mnc: number, lac: number, cid: number, signalStrength?: number);
    /**
     * Creates a cell tower from MCC, MNC and LAC-CID
     * @param mcc Mobile Country Code
     * @param mnc Mobile Network Code
     * @param lac Location Area Code
     * @param cid Cell ID
     * @param signalStrength Signal strength (optional)
     * @returns A new CellTower instance
     */
    static from(mcc: number, mnc: number, lac: number, cid: number, signalStrength?: number): CellTower;
    /**
     * Creates a cell tower from LAC-CID, using the provided MCC and MNC or defaults
     * @param lac Location Area Code
     * @param cid Cell ID
     * @param config Optional configuration for default MCC and MNC
     * @returns A new CellTower instance
     */
    static fromLacCid(lac: number, cid: number, config?: {
        mcc?: number;
        mnc?: number;
    }): CellTower;
    /**
     * Gets the Mobile Country Code
     * @returns The Mobile Country Code
     */
    getMobileCountryCode(): number;
    /**
     * Gets the Mobile Network Code
     * @returns The Mobile Network Code
     */
    getMobileNetworkCode(): number;
    /**
     * Gets the Location Area Code
     * @returns The Location Area Code
     */
    getLocationAreaCode(): number;
    /**
     * Gets the Cell ID
     * @returns The Cell ID
     */
    getCellId(): number;
    /**
     * Gets the signal strength
     * @returns The signal strength or undefined if not available
     */
    getSignalStrength(): number | undefined;
    /**
     * Converts the cell tower to a plain object
     * @returns A plain object representation of the cell tower
     */
    toJSON(): Record<string, any>;
}
