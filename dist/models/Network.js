"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellTower = exports.Network = void 0;
/**
 * Represents network information for the device
 */
class Network {
    constructor() {
        this.cellTowers = [];
    }
    /**
     * Adds a cell tower to the network
     * @param cellTower The cell tower to add
     */
    addCellTower(cellTower) {
        this.cellTowers.push(cellTower);
    }
    /**
     * Gets all cell towers
     * @returns Array of cell towers
     */
    getCellTowers() {
        return [...this.cellTowers];
    }
    /**
     * Converts the network to a plain object
     * @returns A plain object representation of the network
     */
    toJSON() {
        return {
            cellTowers: this.cellTowers.map((tower) => tower.toJSON()),
        };
    }
}
exports.Network = Network;
/**
 * Represents a cell tower
 */
class CellTower {
    /**
     * Creates a new cell tower instance
     * @param mcc Mobile Country Code
     * @param mnc Mobile Network Code
     * @param lac Location Area Code
     * @param cid Cell ID
     * @param signalStrength Signal strength (optional)
     */
    constructor(mcc, mnc, lac, cid, signalStrength) {
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
    static from(mcc, mnc, lac, cid, signalStrength) {
        return new CellTower(mcc, mnc, lac, cid, signalStrength);
    }
    /**
     * Creates a cell tower from LAC-CID, using the provided MCC and MNC or defaults
     * @param lac Location Area Code
     * @param cid Cell ID
     * @param config Optional configuration for default MCC and MNC
     * @returns A new CellTower instance
     */
    static fromLacCid(lac, cid, config) {
        const mcc = config?.mcc || 0;
        const mnc = config?.mnc || 0;
        return new CellTower(mcc, mnc, lac, cid);
    }
    /**
     * Gets the Mobile Country Code
     * @returns The Mobile Country Code
     */
    getMobileCountryCode() {
        return this.mobileCountryCode;
    }
    /**
     * Gets the Mobile Network Code
     * @returns The Mobile Network Code
     */
    getMobileNetworkCode() {
        return this.mobileNetworkCode;
    }
    /**
     * Gets the Location Area Code
     * @returns The Location Area Code
     */
    getLocationAreaCode() {
        return this.locationAreaCode;
    }
    /**
     * Gets the Cell ID
     * @returns The Cell ID
     */
    getCellId() {
        return this.cellId;
    }
    /**
     * Gets the signal strength
     * @returns The signal strength or undefined if not available
     */
    getSignalStrength() {
        return this.signalStrength;
    }
    /**
     * Converts the cell tower to a plain object
     * @returns A plain object representation of the cell tower
     */
    toJSON() {
        const result = {
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
exports.CellTower = CellTower;
//# sourceMappingURL=Network.js.map