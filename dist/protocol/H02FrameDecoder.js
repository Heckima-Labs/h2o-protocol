"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H02FrameDecoder = void 0;
/**
 * Decoder for H02 protocol frames
 */
class H02FrameDecoder {
    /**
     * Creates a new instance of H02FrameDecoder
     * @param messageLength The expected message length (0 for auto-detection)
     */
    constructor(messageLength = 0) {
        this.messageLength = messageLength;
    }
    /**
     * Decodes a buffer containing H02 protocol data
     * @param buffer The buffer to decode
     * @returns The decoded frame buffer or null if no complete frame is found
     */
    decode(buffer) {
        if (!buffer || buffer.length === 0) {
            return null;
        }
        // Get the marker character
        let marker = String.fromCharCode(buffer[0]);
        // Skip any bytes until we find a valid marker
        let startIndex = 0;
        while (marker !== "*" &&
            marker !== "$" &&
            marker !== "X" &&
            startIndex < buffer.length - 1) {
            startIndex++;
            marker = String.fromCharCode(buffer[startIndex]);
        }
        // If we've skipped some bytes, slice the buffer
        if (startIndex > 0) {
            buffer = buffer.slice(startIndex);
            // If buffer is now empty, return null
            if (buffer.length === 0) {
                return null;
            }
            marker = String.fromCharCode(buffer[0]);
        }
        switch (marker) {
            // Text message
            case "*": {
                const endIndex = buffer.indexOf("#");
                if (endIndex !== -1) {
                    // Extract the complete frame including the '#'
                    const result = Buffer.from(buffer.slice(0, endIndex + 1));
                    return result;
                }
                break;
            }
            // Binary message
            case "$": {
                if (this.messageLength === 0) {
                    // Auto-detect message length
                    if (buffer.length === H02FrameDecoder.MESSAGE_LONG) {
                        this.messageLength = H02FrameDecoder.MESSAGE_LONG;
                    }
                    else {
                        this.messageLength = H02FrameDecoder.MESSAGE_SHORT;
                    }
                }
                if (buffer.length >= this.messageLength) {
                    return Buffer.from(buffer.slice(0, this.messageLength));
                }
                break;
            }
            // Another binary format
            case "X": {
                if (buffer.length >= H02FrameDecoder.MESSAGE_SHORT) {
                    return Buffer.from(buffer.slice(0, H02FrameDecoder.MESSAGE_SHORT));
                }
                break;
            }
            default:
                return null;
        }
        return null;
    }
}
exports.H02FrameDecoder = H02FrameDecoder;
// Frame type constants
H02FrameDecoder.MESSAGE_SHORT = 32;
H02FrameDecoder.MESSAGE_LONG = 45;
//# sourceMappingURL=H02FrameDecoder.js.map