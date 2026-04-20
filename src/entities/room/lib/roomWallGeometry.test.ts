import { describe, expect, it } from "vitest";

import {
	getDoorColliderHalfArgs,
	getDoorColliderPosition,
	getDoorMeshArgs,
	getDoorwayPosition,
	getKeyRingPosition,
	getKeyToothPosition,
	getTorchPosition,
	getWallBoxArgs,
	getWallMeshPosition,
	getWallOffsetValue,
	getWallTilePosition,
} from "./roomWallGeometry";

describe("roomWallGeometry", () => {
	describe("getWallOffsetValue", () => {
		it("returns offsetSign * HALF_DEPTH for north/south walls", () => {
			expect(getWallOffsetValue(true, -1)).toBe(-6);
			expect(getWallOffsetValue(true, 1)).toBe(6);
		});

		it("returns offsetSign * HALF_WIDTH for east/west walls", () => {
			expect(getWallOffsetValue(false, 1)).toBe(6);
			expect(getWallOffsetValue(false, -1)).toBe(-6);
		});
	});

	describe("getDoorColliderHalfArgs", () => {
		it("returns [W/2, H/2, T/2] for north/south walls", () => {
			const result = getDoorColliderHalfArgs(true);
			expect(result).toHaveLength(3);
			expect(result[0]).toBeCloseTo(1.35);
			expect(result[1]).toBeCloseTo(1.6);
			expect(result[2]).toBeCloseTo(0.175);
		});

		it("returns [T/2, H/2, W/2] for east/west walls", () => {
			const result = getDoorColliderHalfArgs(false);
			expect(result).toHaveLength(3);
			expect(result[0]).toBeCloseTo(0.175);
			expect(result[1]).toBeCloseTo(1.6);
			expect(result[2]).toBeCloseTo(1.35);
		});
	});

	describe("getDoorMeshArgs", () => {
		it("returns [W, H, T] for north/south walls", () => {
			const result = getDoorMeshArgs(true);
			expect(result).toEqual([2.7, 3.2, 0.35]);
		});

		it("returns [T, H, W] for east/west walls", () => {
			const result = getDoorMeshArgs(false);
			expect(result).toEqual([0.35, 3.2, 2.7]);
		});
	});

	describe("getWallBoxArgs", () => {
		it("returns [WALL_TILE_WIDTH, ROOM_HEIGHT, WALL_THICKNESS] for north/south", () => {
			const result = getWallBoxArgs(true);
			expect(result[0]).toBe(4);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBeGreaterThan(0);
		});

		it("returns [WALL_THICKNESS, ROOM_HEIGHT, WALL_TILE_WIDTH] for east/west", () => {
			const result = getWallBoxArgs(false);
			expect(result[0]).toBeGreaterThan(0);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBe(4);
		});

		it("swaps X and Z between orientations while Y stays the same", () => {
			const ns = getWallBoxArgs(true);
			const ew = getWallBoxArgs(false);
			expect(ns[0]).toBe(ew[2]);
			expect(ns[1]).toBe(ew[1]);
			expect(ns[2]).toBe(ew[0]);
		});
	});

	describe("getDoorColliderPosition", () => {
		it("returns [0, POSITION_Y, offset] for north/south", () => {
			const result = getDoorColliderPosition(true, -6);
			expect(result[0]).toBe(0);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBe(-6);
		});

		it("returns [offset, POSITION_Y, 0] for east/west", () => {
			const result = getDoorColliderPosition(false, 6);
			expect(result[0]).toBe(6);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBe(0);
		});
	});

	describe("getDoorwayPosition", () => {
		it("returns [0, WALL_Y, offset] for north/south", () => {
			const result = getDoorwayPosition(true, -6);
			expect(result[0]).toBe(0);
			expect(result[2]).toBe(-6);
		});

		it("returns [offset, WALL_Y, 0] for east/west", () => {
			const result = getDoorwayPosition(false, 6);
			expect(result[0]).toBe(6);
			expect(result[2]).toBe(0);
		});
	});

	describe("getWallTilePosition", () => {
		it("returns [tilePos, WALL_Y, offset] for north/south", () => {
			const result = getWallTilePosition(true, 4, -6);
			expect(result).toEqual([4, 0, -6]);
		});

		it("returns [offset, WALL_Y, tilePos] for east/west", () => {
			const result = getWallTilePosition(false, -4, 6);
			expect(result).toEqual([6, 0, -4]);
		});
	});

	describe("getWallMeshPosition", () => {
		it("returns [tilePos, 0, offset] for north/south", () => {
			const result = getWallMeshPosition(true, 4, -6);
			expect(result).toEqual([4, 0, -6]);
		});

		it("returns [offset, 0, tilePos] for east/west", () => {
			const result = getWallMeshPosition(false, -4, 6);
			expect(result).toEqual([6, 0, -4]);
		});
	});

	describe("getTorchPosition", () => {
		it("returns [tilePos, HEIGHT, offset + inset] for north/south", () => {
			const result = getTorchPosition(true, 4, -6, -1);
			expect(result[0]).toBe(4);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBeCloseTo(-6 + 1 * 0.2);
		});

		it("returns [offset + inset, HEIGHT, tilePos] for east/west", () => {
			const result = getTorchPosition(false, -4, 6, 1);
			expect(result[0]).toBeCloseTo(6 + -1 * 0.2);
			expect(result[1]).toBeGreaterThan(0);
			expect(result[2]).toBe(-4);
		});

		it("inset direction is always -offsetSign", () => {
			const nsResult = getTorchPosition(true, 0, -6, -1);
			const ewResult = getTorchPosition(false, 0, 6, 1);
			expect(nsResult[2]).toBeCloseTo(-6 + 1 * 0.2);
			expect(ewResult[0]).toBeCloseTo(6 + -1 * 0.2);
		});
	});

	describe("getKeyRingPosition", () => {
		it("returns [-shaftLength/2, 0, 0]", () => {
			const result = getKeyRingPosition(0.34);
			expect(result).toEqual([-0.17, 0, 0]);
		});
	});

	describe("getKeyToothPosition", () => {
		it("returns [shaftLength/2, -toothHeight/2, 0]", () => {
			const result = getKeyToothPosition(0.34, 0.11);
			expect(result).toEqual([0.17, -0.055, 0]);
		});
	});
});
