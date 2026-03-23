import { describe, expect, it } from "vitest";

import { XSTATE_ACTOR_STATUS } from "@/shared/config";

import { shouldSubmitFloorScore } from "./floorCompletion";

describe("shouldSubmitFloorScore", () => {
	it("returns true when status is done and not yet submitted", () => {
		expect(shouldSubmitFloorScore(XSTATE_ACTOR_STATUS.DONE, false)).toBe(true);
	});

	it("returns false when status is active", () => {
		expect(shouldSubmitFloorScore(XSTATE_ACTOR_STATUS.ACTIVE, false)).toBe(
			false,
		);
	});

	it("returns false when already submitted", () => {
		expect(shouldSubmitFloorScore(XSTATE_ACTOR_STATUS.DONE, true)).toBe(false);
	});

	it("returns false when active and already submitted", () => {
		expect(shouldSubmitFloorScore(XSTATE_ACTOR_STATUS.ACTIVE, true)).toBe(
			false,
		);
	});
});
