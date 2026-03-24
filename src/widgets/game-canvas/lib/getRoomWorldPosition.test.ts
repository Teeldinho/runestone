import { describe, expect, it } from "vitest";

import { getRoomWorldPosition } from "./getRoomWorldPosition";

const MOCK_ROOMS = [
	{
		roomId: "entrance",
		label: "Entrance",
		position: [-20, 0, 0] as [number, number, number],
		isInitial: true,
		isFinal: false,
	},
	{
		roomId: "library",
		label: "Library",
		position: [0, 0, 20] as [number, number, number],
		isInitial: false,
		isFinal: false,
	},
	{
		roomId: "exit",
		label: "Exit",
		position: [20, 0, 40] as [number, number, number],
		isInitial: false,
		isFinal: true,
	},
];

describe("getRoomWorldPosition", () => {
	it("returns [x, spawnHeight, z] for a known room", () => {
		const result = getRoomWorldPosition(MOCK_ROOMS, "entrance", 1.5);

		expect(result).toEqual([-20, 1.5, 0]);
	});

	it("uses the room x and z, substituting spawnHeightOffset for y", () => {
		const result = getRoomWorldPosition(MOCK_ROOMS, "library", 0.5);

		expect(result).toEqual([0, 0.5, 20]);
	});

	it("returns null for an unknown roomId", () => {
		const result = getRoomWorldPosition(MOCK_ROOMS, "nonexistent", 1.0);

		expect(result).toBeNull();
	});

	it("handles an empty rooms array", () => {
		const result = getRoomWorldPosition([], "entrance", 1.0);

		expect(result).toBeNull();
	});
});
