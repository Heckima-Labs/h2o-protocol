/**
 * Decoder for H02 protocol frames
 */
export declare class H02FrameDecoder {
    private static readonly MESSAGE_SHORT;
    private static readonly MESSAGE_LONG;
    private messageLength;
    /**
     * Creates a new instance of H02FrameDecoder
     * @param messageLength The expected message length (0 for auto-detection)
     */
    constructor(messageLength?: number);
    /**
     * Decodes a buffer containing H02 protocol data
     * @param buffer The buffer to decode
     * @returns The decoded frame buffer or null if no complete frame is found
     */
    decode(buffer: Buffer): Buffer | null;
}
