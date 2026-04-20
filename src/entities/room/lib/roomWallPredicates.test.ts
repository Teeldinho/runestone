import { describe, expect, it } from "vitest";

import type { RoomWallOpening } from "../model";
import {
	hasOpening,
	isDoorLocked,
	isDoorOpened,
	shouldRenderCollider,
} from "./roomWallPredicates";

describe("roomWallPredicates", () => {
	const north: RoomWallOpening = "north";
	const south: RoomWallOpening = "south";
	const east: RoomWallOpening = "east";

	describe("hasOpening", () => {
		it("returns true when side is in wallOpenings", () => {
			expect(hasOpening(north, [north, east])).toBe(true);
		});

		it("returns false when side is not in wallOpenings", () => {
			expect(hasOpening(north, [south, east])).toBe(false);
		});

		it("returns false for empty wallOpenings", () => {
			expect(hasOpening(north, [])).toBe(false);
		});
	});

	describe("isDoorLocked", () => {
		it("returns true when side is in lockedDoorSides", () => {
			expect(isDoorLocked(north, [north])).toBe(true);
		});

		it("returns false when side is not in lockedDoorSides", () => {
			expect(isDoorLocked(north, [south])).toBe(false);
		});
	});

	describe("isDoorOpened", () => {
		it("returns true when side is in openedDoorSides", () => {
			expect(isDoorOpened(north, [north])).toBe(true);
		});

		it("returns false when side is not in openedDoorSides", () => {
			expect(isDoorOpened(north, [south])).toBe(false);
		});
	});

	describe("shouldRenderCollider", () => {
		it("returns true when side has opening and door is not opened", () => {
			expect(shouldRenderCollider(north, [north], [])).toBe(true);
		});

		it("returns false when side has no opening", () => {
			expect(shouldRenderCollider(north, [], [])).toBe(false);
		});

		it("returns false when side has opening but door is opened", () => {
			expect(shouldRenderCollider(north, [north], [north])).toBe(false);
		});

		it("returns true when side has opening and other doors are opened but not this one", () => {
			expect(shouldRenderCollider(north, [north, south], [south])).toBe(true);
		});
	});
});
