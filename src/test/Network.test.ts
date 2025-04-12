import { Network, CellTower } from "../models/Network";

describe("Network", () => {
  // Test Network class
  test("should create network with empty cell towers", () => {
    const network = new Network();
    expect(network.getCellTowers()).toEqual([]);
  });

  test("should add cell tower to network", () => {
    const network = new Network();
    const cellTower = new CellTower(310, 410, 1234, 5678);

    network.addCellTower(cellTower);

    const cellTowers = network.getCellTowers();
    expect(cellTowers.length).toBe(1);
    expect(cellTowers[0]).toBe(cellTower);
  });

  test("should return a copy of cell towers array", () => {
    const network = new Network();
    const cellTower = new CellTower(310, 410, 1234, 5678);

    network.addCellTower(cellTower);

    const cellTowers = network.getCellTowers();
    // Modifying the returned array should not affect the original
    cellTowers.push(new CellTower(310, 410, 8765, 4321));

    expect(network.getCellTowers().length).toBe(1);
  });

  test("should convert network to JSON", () => {
    const network = new Network();
    const cellTower1 = new CellTower(310, 410, 1234, 5678, -85);
    const cellTower2 = new CellTower(310, 411, 8765, 4321);

    network.addCellTower(cellTower1);
    network.addCellTower(cellTower2);

    const json = network.toJSON();
    expect(json).toEqual({
      cellTowers: [
        {
          mobileCountryCode: 310,
          mobileNetworkCode: 410,
          locationAreaCode: 1234,
          cellId: 5678,
          signalStrength: -85,
        },
        {
          mobileCountryCode: 310,
          mobileNetworkCode: 411,
          locationAreaCode: 8765,
          cellId: 4321,
        },
      ],
    });
  });
});

describe("CellTower", () => {
  // Test CellTower constructor
  test("should create cell tower with provided values", () => {
    const cellTower = new CellTower(310, 410, 1234, 5678, -85);

    expect(cellTower.getMobileCountryCode()).toBe(310);
    expect(cellTower.getMobileNetworkCode()).toBe(410);
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBe(-85);
  });

  test("should create cell tower without signal strength", () => {
    const cellTower = new CellTower(310, 410, 1234, 5678);

    expect(cellTower.getMobileCountryCode()).toBe(310);
    expect(cellTower.getMobileNetworkCode()).toBe(410);
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBeUndefined();
  });

  // Test static factory method from
  test("should create cell tower using from factory method", () => {
    const cellTower = CellTower.from(310, 410, 1234, 5678, -85);

    expect(cellTower.getMobileCountryCode()).toBe(310);
    expect(cellTower.getMobileNetworkCode()).toBe(410);
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBe(-85);
  });

  // Test fromLacCid with default MCC and MNC
  test("should create cell tower using fromLacCid with default MCC and MNC", () => {
    const cellTower = CellTower.fromLacCid(1234, 5678);

    expect(cellTower.getMobileCountryCode()).toBe(0);
    expect(cellTower.getMobileNetworkCode()).toBe(0);
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBeUndefined();
  });

  // Test fromLacCid with provided MCC and MNC
  test("should create cell tower using fromLacCid with provided MCC and MNC", () => {
    const cellTower = CellTower.fromLacCid(1234, 5678, { mcc: 310, mnc: 410 });

    expect(cellTower.getMobileCountryCode()).toBe(310);
    expect(cellTower.getMobileNetworkCode()).toBe(410);
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBeUndefined();
  });

  // Test fromLacCid with partial config (only MCC)
  test("should create cell tower using fromLacCid with partial config", () => {
    const cellTower = CellTower.fromLacCid(1234, 5678, { mcc: 310 });

    expect(cellTower.getMobileCountryCode()).toBe(310);
    expect(cellTower.getMobileNetworkCode()).toBe(0); // Default
    expect(cellTower.getLocationAreaCode()).toBe(1234);
    expect(cellTower.getCellId()).toBe(5678);
    expect(cellTower.getSignalStrength()).toBeUndefined();
  });

  // Test toJSON with signal strength
  test("should convert cell tower with signal strength to JSON", () => {
    const cellTower = new CellTower(310, 410, 1234, 5678, -85);

    const json = cellTower.toJSON();
    expect(json).toEqual({
      mobileCountryCode: 310,
      mobileNetworkCode: 410,
      locationAreaCode: 1234,
      cellId: 5678,
      signalStrength: -85,
    });
  });

  // Test toJSON without signal strength
  test("should convert cell tower without signal strength to JSON", () => {
    const cellTower = new CellTower(310, 410, 1234, 5678);

    const json = cellTower.toJSON();
    expect(json).toEqual({
      mobileCountryCode: 310,
      mobileNetworkCode: 410,
      locationAreaCode: 1234,
      cellId: 5678,
    });
    expect(json.signalStrength).toBeUndefined();
  });
});
