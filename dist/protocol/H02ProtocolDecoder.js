"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H02ProtocolDecoder = void 0;
const Position_1 = require("../models/Position");
const Network_1 = require("../models/Network");
const BitUtil_1 = require("../utils/BitUtil");
const BcdUtil_1 = require("../utils/BcdUtil");
const DateBuilder_1 = require("../utils/DateBuilder");
/**
 * Protocol decoder for H02 protocol
 */
class H02ProtocolDecoder {
    /**
     * Creates a new instance of H02ProtocolDecoder
     * @param config Optional configuration
     */
    constructor(config = {}) {
        this.protocolName = "h02";
        this.config = {};
        this.deviceSessions = new Map();
        this.config = config;
    }
    /**
     * Decodes buffer data to a Position object
     * @param buffer The buffer data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    decode(buffer, remoteAddress) {
        if (!buffer || buffer.length === 0) {
            return null;
        }
        const marker = String.fromCharCode(buffer[0]);
        switch (marker) {
            case "*":
                return this.decodeText(buffer.toString("ascii").trim(), remoteAddress);
            case "$":
                return this.decodeBinary(buffer, remoteAddress);
            default:
                return null;
        }
    }
    /**
     * Decodes binary data to a Position object
     * @param buf The buffer data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    decodeBinary(buf, remoteAddress) {
        const position = new Position_1.Position(this.protocolName);
        const longId = buf.length === 42;
        // Skip the first byte (marker)
        buf = buf.slice(1);
        let id;
        if (longId) {
            id = buf.slice(0, 8).toString("hex").substring(0, 15);
            buf = buf.slice(8);
        }
        else {
            id = buf.slice(0, 5).toString("hex");
            buf = buf.slice(5);
        }
        const deviceId = this.getDeviceId(id, remoteAddress);
        if (!deviceId) {
            return null;
        }
        position.setDeviceId(deviceId);
        // Parse date and time
        const dateBuilder = new DateBuilder_1.DateBuilder()
            .setHour(BcdUtil_1.BcdUtil.readInteger(buf, 0, 1))
            .setMinute(BcdUtil_1.BcdUtil.readInteger(buf, 1, 1))
            .setSecond(BcdUtil_1.BcdUtil.readInteger(buf, 2, 1))
            .setDay(BcdUtil_1.BcdUtil.readInteger(buf, 3, 1))
            .setMonth(BcdUtil_1.BcdUtil.readInteger(buf, 4, 1))
            .setYear(BcdUtil_1.BcdUtil.readInteger(buf, 5, 1));
        position.setTime(dateBuilder.getDate());
        buf = buf.slice(6);
        // Read latitude
        let latitude = this.readCoordinate(buf, false);
        // Read battery level
        position.set(Position_1.Position.KEY_BATTERY_LEVEL, this.decodeBattery(buf[4]));
        // Read longitude
        buf = buf.slice(5);
        let longitude = this.readCoordinate(buf, true);
        // Parse flags and adjust coordinates
        const flags = buf[4] & 0x0f;
        position.setValid((flags & 0x02) !== 0);
        if ((flags & 0x04) === 0) {
            latitude = -latitude;
        }
        if ((flags & 0x08) === 0) {
            longitude = -longitude;
        }
        position.setLatitude(latitude);
        position.setLongitude(longitude);
        buf = buf.slice(5);
        // Read speed and course
        position.setSpeed(BcdUtil_1.BcdUtil.readInteger(buf, 0, 3));
        position.setCourse((buf[3] & 0x0f) * 100.0 + BcdUtil_1.BcdUtil.readInteger(buf, 4, 1));
        buf = buf.slice(5);
        // Read status
        this.processStatus(position, buf.readUInt32BE(0));
        return position;
    }
    /**
     * Decodes text data to a Position object
     * @param sentence The text data to decode
     * @param remoteAddress The remote address
     * @returns The decoded Position object or null if decoding failed
     */
    decodeText(sentence, remoteAddress) {
        // Split the sentence by commas
        const parts = sentence.split(",");
        if (parts.length < 4) {
            return null;
        }
        // Verify it's a H02 protocol message
        if (parts[0] !== "*HQ" &&
            parts[0] !== "*TQ" &&
            parts[0] !== "*DW" &&
            parts[0] !== "*hq") {
            return null;
        }
        const id = parts[1];
        const deviceId = this.getDeviceId(id, remoteAddress);
        if (!deviceId) {
            return null;
        }
        const position = new Position_1.Position(this.protocolName);
        position.setDeviceId(deviceId);
        // Determine message type
        const type = parts[2];
        switch (type) {
            case "V1":
                return this.decodeV1(position, parts);
            case "V4":
                return this.decodeV4(position, parts);
            case "NBR":
                return this.decodeNBR(position, parts);
            case "LINK":
                return this.decodeLink(position, parts);
            case "V3":
                return this.decodeV3(position, parts);
            case "VP1":
                return this.decodeVP1(position, parts);
            case "HTBT":
                return this.decodeHeartbeat(position, parts);
            default:
                return this.decodeRegular(position, parts);
        }
    }
    /**
     * Decode standard position message
     */
    decodeRegular(position, parts) {
        const dateBuilder = new DateBuilder_1.DateBuilder();
        let index = 3;
        // Time
        if (parts.length > index && parts[index].length === 6) {
            dateBuilder.setTime(parseInt(parts[index].substring(0, 2), 10), parseInt(parts[index].substring(2, 4), 10), parseInt(parts[index].substring(4, 6), 10));
            index++;
        }
        // Validity
        if (parts.length > index) {
            if (parts[index] === "A" || parts[index] === "V") {
                position.setValid(parts[index] === "A");
                index++;
            }
            else if (/^\d+$/.test(parts[index])) {
                position.setValid(true);
                index++;
            }
        }
        // Latitude
        if (parts.length > index + 2) {
            let latitude = 0;
            let longitude = 0;
            // Parse latitude and longitude based on format
            if (parts[index].includes("-") && parts[index + 2].includes("-")) {
                // Format: -DD-MM.MMMM
                latitude = parseFloat(parts[index].replace("-", "").replace("-", "."));
                index++;
                if (parts[index] === "S") {
                    latitude = -latitude;
                }
                index++;
                longitude = parseFloat(parts[index].replace("-", "").replace("-", "."));
                index++;
                if (parts[index] === "W") {
                    longitude = -longitude;
                }
                index++;
            }
            else if (/^\d+$/.test(parts[index].charAt(0)) &&
                parts[index + 1].length === 1) {
                // Format: DDDMM.MMMM
                latitude =
                    parseFloat(parts[index].substring(0, 2)) +
                        parseFloat(parts[index].substring(2)) / 60.0;
                index++;
                if (parts[index] === "S") {
                    latitude = -latitude;
                }
                index++;
                longitude =
                    parseFloat(parts[index].substring(0, 3)) +
                        parseFloat(parts[index].substring(3)) / 60.0;
                index++;
                if (parts[index] === "W") {
                    longitude = -longitude;
                }
                index++;
            }
            else if (parts[index].length === 10 && parts[index + 2].length === 11) {
                // Format: DDDMMSSSS (degrees, minutes, seconds in ten-thousandths)
                const degrees = parseInt(parts[index].substring(0, 2), 10);
                const minutes = parseInt(parts[index].substring(2, 4), 10);
                const seconds = parseInt(parts[index].substring(4), 10) / 10000.0;
                latitude = degrees + minutes / 60.0 + seconds / 3600.0;
                index++;
                if (parts[index] === "S") {
                    latitude = -latitude;
                }
                index++;
                const degreesLon = parseInt(parts[index].substring(0, 3), 10);
                const minutesLon = parseInt(parts[index].substring(3, 5), 10);
                const secondsLon = parseInt(parts[index].substring(5), 10) / 10000.0;
                longitude = degreesLon + minutesLon / 60.0 + secondsLon / 3600.0;
                index++;
                if (parts[index] === "W") {
                    longitude = -longitude;
                }
                index++;
            }
            position.setLatitude(latitude);
            position.setLongitude(longitude);
        }
        // Speed
        if (parts.length > index) {
            position.setSpeed(parseFloat(parts[index]) * 1.852); // Convert knots to km/h
            index++;
        }
        // Course
        if (parts.length > index) {
            position.setCourse(parseFloat(parts[index]));
            index++;
        }
        // Date
        if (parts.length > index && parts[index].length === 6) {
            dateBuilder.setDateReverse(parseInt(parts[index].substring(0, 2), 10), parseInt(parts[index].substring(2, 4), 10), parseInt(parts[index].substring(4, 6), 10));
            index++;
        }
        position.setTime(dateBuilder.getDate());
        // Status
        if (parts.length > index && parts[index].length === 8) {
            const status = parseInt(parts[index], 16);
            this.processStatus(position, status);
            index++;
        }
        // Additional data
        if (parts.length > index) {
            // Check for optional data format
            if (parts.length > index + 5 &&
                parts[index + 1].includes(".") &&
                parts[index + 3].length === 4) {
                // Extended data format
                position.set(Position_1.Position.KEY_ODOMETER, parseInt(parts[index], 10));
                position.set(Position_1.Position.PREFIX_TEMP + 1, parseInt(parts[index + 1], 10));
                position.set(Position_1.Position.KEY_FUEL_LEVEL, parseFloat(parts[index + 2]));
                position.setAltitude(parseInt(parts[index + 3], 10));
                const lac = parseInt(parts[index + 4], 16);
                const cid = parseInt(parts[index + 5], 16);
                position.setNetwork(new Network_1.Network());
                position.getNetwork()?.addCellTower(Network_1.CellTower.fromLacCid(lac, cid));
            }
            else {
                // Simple IO data format
                const ioValues = parts.slice(index).join(",").split(",");
                for (let i = 0; i < ioValues.length; i++) {
                    position.set(Position_1.Position.PREFIX_IO + (i + 1), ioValues[i].trim());
                }
            }
        }
        return position;
    }
    /**
     * Decode V1 message (response to command)
     */
    decodeV1(position, parts) {
        this.getLastLocation(position, new Date());
        return position;
    }
    /**
     * Decode V4 message (response to command)
     */
    decodeV4(position, parts) {
        if (parts.length >= 4) {
            position.set(Position_1.Position.KEY_RESULT, parts[3]);
        }
        this.getLastLocation(position, new Date());
        return position;
    }
    /**
     * Decode NBR message (cell towers)
     */
    decodeNBR(position, parts) {
        if (parts.length < 10) {
            return null;
        }
        const dateBuilder = new DateBuilder_1.DateBuilder().setTime(parseInt(parts[3].substring(0, 2), 10), parseInt(parts[3].substring(2, 4), 10), parseInt(parts[3].substring(4, 6), 10));
        const network = new Network_1.Network();
        const mcc = parseInt(parts[4], 10);
        const mnc = parseInt(parts[5], 10);
        // Skip delay time and count
        const cellsStr = parts[8];
        const cells = cellsStr.split("Y");
        for (const cell of cells) {
            const cellParts = cell.split(",");
            if (cellParts.length >= 3) {
                network.addCellTower(Network_1.CellTower.from(mcc, mnc, parseInt(cellParts[0], 10), parseInt(cellParts[1], 10), parseInt(cellParts[2], 10)));
            }
        }
        position.setNetwork(network);
        dateBuilder.setDateReverse(parseInt(parts[9].substring(0, 2), 10), parseInt(parts[9].substring(2, 4), 10), parseInt(parts[9].substring(4, 6), 10));
        this.getLastLocation(position, dateBuilder.getDate());
        if (parts.length >= 11) {
            this.processStatus(position, parseInt(parts[10], 16));
        }
        return position;
    }
    /**
     * Decode LINK message (device status)
     */
    decodeLink(position, parts) {
        if (parts.length < 10) {
            return null;
        }
        const dateBuilder = new DateBuilder_1.DateBuilder().setTime(parseInt(parts[3].substring(0, 2), 10), parseInt(parts[3].substring(2, 4), 10), parseInt(parts[3].substring(4, 6), 10));
        position.set(Position_1.Position.KEY_RSSI, parseInt(parts[4], 10));
        position.set(Position_1.Position.KEY_SATELLITES, parseInt(parts[5], 10));
        position.set(Position_1.Position.KEY_BATTERY_LEVEL, parseInt(parts[6], 10));
        position.set(Position_1.Position.KEY_STEPS, parseInt(parts[7], 10));
        position.set("turnovers", parseInt(parts[8], 10));
        dateBuilder.setDateReverse(parseInt(parts[9].substring(0, 2), 10), parseInt(parts[9].substring(2, 4), 10), parseInt(parts[9].substring(4, 6), 10));
        this.getLastLocation(position, dateBuilder.getDate());
        if (parts.length >= 11) {
            this.processStatus(position, parseInt(parts[10], 16));
        }
        return position;
    }
    /**
     * Decode V3 message (cell towers)
     */
    decodeV3(position, parts) {
        if (parts.length < 11) {
            return null;
        }
        const dateBuilder = new DateBuilder_1.DateBuilder().setTime(parseInt(parts[3].substring(0, 2), 10), parseInt(parts[3].substring(2, 4), 10), parseInt(parts[3].substring(4, 6), 10));
        const mcc = parseInt(parts[4], 10);
        const mnc = parseInt(parts[5], 10);
        const count = parseInt(parts[6], 10);
        const network = new Network_1.Network();
        const cells = parts[7].split(",");
        for (let i = 0; i < count && i * 4 + 1 < cells.length; i++) {
            network.addCellTower(Network_1.CellTower.from(mcc, mnc, parseInt(cells[i * 4], 10), parseInt(cells[i * 4 + 1], 10)));
        }
        position.setNetwork(network);
        position.set(Position_1.Position.KEY_BATTERY, parseInt(parts[8], 16));
        dateBuilder.setDateReverse(parseInt(parts[10].substring(0, 2), 10), parseInt(parts[10].substring(2, 4), 10), parseInt(parts[10].substring(4, 6), 10));
        this.getLastLocation(position, dateBuilder.getDate());
        if (parts.length >= 12) {
            this.processStatus(position, parseInt(parts[11], 16));
        }
        return position;
    }
    /**
     * Decode VP1 message (GPS or cell towers)
     */
    decodeVP1(position, parts) {
        if (parts.length < 6) {
            return null;
        }
        // Check if it's a cell tower message or GPS message
        if (parts[3] === "V") {
            // Cell tower message
            this.getLastLocation(position, new Date());
            const mcc = parseInt(parts[4], 10);
            const mnc = parseInt(parts[5], 10);
            const network = new Network_1.Network();
            const cellsData = parts[6].split("Y");
            for (const cell of cellsData) {
                const cellParts = cell.split(",");
                if (cellParts.length >= 3) {
                    network.addCellTower(Network_1.CellTower.from(mcc, mnc, parseInt(cellParts[0], 10), parseInt(cellParts[1], 10), parseInt(cellParts[2], 10)));
                }
            }
            position.setNetwork(network);
        }
        else if (parts[3] === "A" || parts[3] === "B") {
            // GPS message
            position.setValid(parts[3] === "A");
            // Parse latitude
            if (parts.length >= 6) {
                const latitude = parseInt(parts[4].substring(0, 2), 10) +
                    parseFloat(parts[4].substring(2)) / 60.0;
                position.setLatitude(parts[5] === "N" ? latitude : -latitude);
            }
            // Parse longitude
            if (parts.length >= 8) {
                const longitude = parseInt(parts[6].substring(0, 3), 10) +
                    parseFloat(parts[6].substring(3)) / 60.0;
                position.setLongitude(parts[7] === "E" ? longitude : -longitude);
            }
            // Parse speed, course
            if (parts.length >= 10) {
                position.setSpeed(parseFloat(parts[8]));
                position.setCourse(parseFloat(parts[9]));
            }
            // Parse date
            if (parts.length >= 11 && parts[10].length === 6) {
                position.setTime(new DateBuilder_1.DateBuilder()
                    .setDateReverse(parseInt(parts[10].substring(0, 2), 10), parseInt(parts[10].substring(2, 4), 10), parseInt(parts[10].substring(4, 6), 10))
                    .getDate());
            }
            else {
                position.setTime(new Date());
            }
        }
        return position;
    }
    /**
     * Decode heartbeat message (HTBT)
     */
    decodeHeartbeat(position, parts) {
        if (parts.length < 4) {
            return null;
        }
        this.getLastLocation(position, new Date());
        position.set(Position_1.Position.KEY_BATTERY_LEVEL, parseInt(parts[3], 10));
        return position;
    }
    /**
     * Process device status
     */
    processStatus(position, status) {
        if (!BitUtil_1.BitUtil.check(status, 0)) {
            position.addAlarm(Position_1.Position.ALARM_VIBRATION);
        }
        else if (!BitUtil_1.BitUtil.check(status, 1) || !BitUtil_1.BitUtil.check(status, 18)) {
            position.addAlarm(Position_1.Position.ALARM_SOS);
        }
        else if (!BitUtil_1.BitUtil.check(status, 2)) {
            position.addAlarm(Position_1.Position.ALARM_OVERSPEED);
        }
        else if (!BitUtil_1.BitUtil.check(status, 19)) {
            position.addAlarm(Position_1.Position.ALARM_POWER_CUT);
        }
        position.set(Position_1.Position.KEY_IGNITION, BitUtil_1.BitUtil.check(status, 10));
        position.set(Position_1.Position.KEY_STATUS, status);
    }
    /**
     * Decode battery level
     */
    decodeBattery(value) {
        if (value === 0) {
            return null;
        }
        else if (value <= 3) {
            return (value - 1) * 10;
        }
        else if (value <= 6) {
            return (value - 1) * 20;
        }
        else if (value <= 100) {
            return value;
        }
        else if (value >= 0xf1 && value <= 0xf6) {
            return value - 0xf0;
        }
        else {
            return null;
        }
    }
    /**
     * Read coordinate from buffer
     */
    readCoordinate(buf, lon) {
        let degrees = BcdUtil_1.BcdUtil.readInteger(buf, 0, 2);
        if (lon) {
            degrees = degrees * 10 + (buf[2] >> 4);
        }
        let result = 0;
        if (lon) {
            result = buf[2] & 0x0f;
        }
        const length = lon ? 5 : 6;
        if (lon) {
            result =
                result * 10 + BcdUtil_1.BcdUtil.readInteger(buf.slice(3), 0, length - 3) * 0.0001;
        }
        else {
            result =
                result * 10 + BcdUtil_1.BcdUtil.readInteger(buf.slice(2), 0, length - 2) * 0.0001;
        }
        result /= 60;
        result += degrees;
        return result;
    }
    /**
     * Get the device ID from the device identifier and remote address
     */
    getDeviceId(deviceIdentifier, remoteAddress) {
        // Lookup previously stored device ID
        if (this.deviceSessions.has(deviceIdentifier)) {
            return this.deviceSessions.get(deviceIdentifier) || null;
        }
        // For testing/demo purposes, use the identifier directly
        // In a real implementation, this would validate against a database
        this.deviceSessions.set(deviceIdentifier, deviceIdentifier);
        return deviceIdentifier;
    }
    /**
     * Get the last known location or create one with the provided time
     */
    getLastLocation(position, time) {
        if (time) {
            position.setTime(time);
        }
        else {
            position.setTime(new Date());
        }
    }
}
exports.H02ProtocolDecoder = H02ProtocolDecoder;
//# sourceMappingURL=H02ProtocolDecoder.js.map