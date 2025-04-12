import * as packageExports from "../index";
import { Position } from "../models/Position";
import { Command } from "../models/Command";
import { Network, CellTower } from "../models/Network";
import { H02Protocol } from "../protocol/H02Protocol";
import { H02FrameDecoder } from "../protocol/H02FrameDecoder";
import { H02ProtocolDecoder } from "../protocol/H02ProtocolDecoder";
import { H02ProtocolEncoder } from "../protocol/H02ProtocolEncoder";
import { BitUtil } from "../utils/BitUtil";
import { BcdUtil } from "../utils/BcdUtil";
import { DateBuilder } from "../utils/DateBuilder";

describe("index exports", () => {
  test("should export all expected models", () => {
    expect(packageExports.Position).toBe(Position);
    expect(packageExports.Command).toBe(Command);
    expect(packageExports.Network).toBe(Network);
    expect(packageExports.CellTower).toBe(CellTower);
  });

  test("should export all expected protocol components", () => {
    expect(packageExports.H02Protocol).toBe(H02Protocol);
    expect(packageExports.H02FrameDecoder).toBe(H02FrameDecoder);
    expect(packageExports.H02ProtocolDecoder).toBe(H02ProtocolDecoder);
    expect(packageExports.H02ProtocolEncoder).toBe(H02ProtocolEncoder);
  });

  test("should export all expected utilities", () => {
    expect(packageExports.BitUtil).toBe(BitUtil);
    expect(packageExports.BcdUtil).toBe(BcdUtil);
    expect(packageExports.DateBuilder).toBe(DateBuilder);
  });
});
