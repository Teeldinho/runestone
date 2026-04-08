import { describe, expect, it } from "vitest";

import type { Vector3Tuple } from "@/shared/types";

import { selectNearestRoomPositions } from "./selectNearestRoomPositions";

const ROOM_POSITIONS: Vector3Tuple[] = [
	[0, 0, -40],
	[0, 0, -20],
	[0, 0, 0],
	[0, 0, 20],
	[0, 0, 40],
];

describe("selectNearestRoomPositions", () => {
	it("returns the nearest room positions around the current room", () => {
		expect(
			selectNearestRoomPositions({
				roomPositions: ROOM_POSITIONS,
				currentRoomPosition: [0, 0, 0],
				maxRoomCount: 3,
			}),
		).toEqual([
			[0, 0, 0],
			[0, 0, -20],
			[0, 0, 20],
		]);
	});

	it("returns all room positions when maxRoomCount exceeds room count", () => {
		expect(
			selectNearestRoomPositions({
				roomPositions: ROOM_POSITIONS,
				currentRoomPosition: [0, 0, 0],
				maxRoomCount: 99,
			}),
		).toHaveLength(ROOM_POSITIONS.length);
	});

	it("returns no room positions when maxRoomCount is zero", () => {
		expect(
			selectNearestRoomPositions({
				roomPositions: ROOM_POSITIONS,
				currentRoomPosition: [0, 0, 0],
				maxRoomCount: 0,
			}),
		).toEqual([]);
	});

	it("falls back to source ordering when current room position is unavailable", () => {
		expect(
			selectNearestRoomPositions({
				roomPositions: ROOM_POSITIONS,
				currentRoomPosition: null,
				maxRoomCount: 2,
			}),
		).toEqual([
			[0, 0, -40],
			[0, 0, -20],
		]);
	});
});
