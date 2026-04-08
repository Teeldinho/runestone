import { describe, expect, it } from "vitest";

import type { Vector3Tuple } from "@/shared/types";

import { createRoomTorchPositions } from "./createRoomTorchPositions";

const ROOM_POSITIONS: Vector3Tuple[] = [
	[0, 0, 0],
	[10, 0, -5],
];

const LOCAL_TORCH_POSITIONS: Vector3Tuple[] = [
	[-4, 0, -4],
	[4, 0, 4],
];

describe("createRoomTorchPositions", () => {
	it("translates local torch offsets into world positions for each room", () => {
		expect(
			createRoomTorchPositions({
				localTorchPositions: LOCAL_TORCH_POSITIONS,
				roomPositions: ROOM_POSITIONS,
			}),
		).toEqual([
			[-4, 0, -4],
			[4, 0, 4],
			[6, 0, -9],
			[14, 0, -1],
		]);
	});

	it("returns an empty list when no rooms are present", () => {
		expect(
			createRoomTorchPositions({
				localTorchPositions: LOCAL_TORCH_POSITIONS,
				roomPositions: [],
			}),
		).toEqual([]);
	});
});
