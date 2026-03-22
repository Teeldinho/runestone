import { describe, expect, it } from "vitest";

import { ROOM_ENTITY_CONFIG } from "../config";

import {
	getRoomBounds,
	getRoomCorridorAnchors,
	getRoomLabelPosition,
	getRoomTorchPositions,
} from "./roomGeometry";

describe("roomGeometry", () => {
	it("derives room bounds from center and dimensions", () => {
		const roomBounds = getRoomBounds({
			center: ROOM_ENTITY_CONFIG.ORIGIN,
			dimensions: ROOM_ENTITY_CONFIG.DIMENSIONS,
		});

		expect(roomBounds).toEqual({
			max: [6, 3, 6],
			min: [-6, -3, -6],
		});
	});

	it("returns cardinal corridor anchors on each room edge", () => {
		const corridorAnchors = getRoomCorridorAnchors({
			center: ROOM_ENTITY_CONFIG.ORIGIN,
			dimensions: ROOM_ENTITY_CONFIG.DIMENSIONS,
		});

		expect(corridorAnchors).toEqual({
			east: [6, 0, 0],
			north: [0, 0, -6],
			south: [0, 0, 6],
			west: [-6, 0, 0],
		});
	});

	it("returns four torch positions around room perimeter", () => {
		const torchPositions = getRoomTorchPositions({
			center: ROOM_ENTITY_CONFIG.ORIGIN,
			height: ROOM_ENTITY_CONFIG.TORCH.HEIGHT,
			inset: ROOM_ENTITY_CONFIG.TORCH.INSET,
		});

		expect(torchPositions).toEqual([
			[-4, 2.2, -4],
			[4, 2.2, -4],
			[-4, 2.2, 4],
			[4, 2.2, 4],
		]);
	});

	it("returns label position above room center", () => {
		const roomLabelPosition = getRoomLabelPosition({
			center: ROOM_ENTITY_CONFIG.ORIGIN,
			heightOffset: ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET,
		});

		expect(roomLabelPosition).toEqual([0, 7, 0]);
	});
});
