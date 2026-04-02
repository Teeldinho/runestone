import { describe, expect, it } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";

import { shouldSubmitFloorScore } from "./floorCompletion";

describe("shouldSubmitFloorScore", () => {
	it("returns true when state value is EXIT and not yet submitted", () => {
		expect(shouldSubmitFloorScore(ROOM_IDS.EXIT, false)).toBe(true);
	});

	it("returns false when state value is a non-exit room", () => {
		expect(shouldSubmitFloorScore(ROOM_IDS.ENTRANCE, false)).toBe(false);
	});

	it("returns false when already submitted even if at EXIT", () => {
		expect(shouldSubmitFloorScore(ROOM_IDS.EXIT, true)).toBe(false);
	});

	it("returns false when at guard room and already submitted", () => {
		expect(shouldSubmitFloorScore(ROOM_IDS.GUARD_ROOM, true)).toBe(false);
	});
});
