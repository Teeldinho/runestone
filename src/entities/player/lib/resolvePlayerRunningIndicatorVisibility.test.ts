import { describe, expect, it } from "vitest";

import { PLAYER_STATES } from "../config";

import { resolvePlayerRunningIndicatorVisibility } from "./resolvePlayerRunningIndicatorVisibility";

describe("resolvePlayerRunningIndicatorVisibility", () => {
	it("hides the indicator on mobile layouts", () => {
		expect(
			resolvePlayerRunningIndicatorVisibility({
				isAvatarVisible: true,
				isDesktopLayout: false,
				movementState: PLAYER_STATES.MOVEMENT.RUNNING,
			}),
		).toBe(false);
	});

	it("shows the indicator when the avatar is not visible on desktop", () => {
		expect(
			resolvePlayerRunningIndicatorVisibility({
				isAvatarVisible: false,
				isDesktopLayout: true,
				movementState: PLAYER_STATES.MOVEMENT.RUNNING,
			}),
		).toBe(true);
	});

	it("hides the indicator when the player is not running", () => {
		expect(
			resolvePlayerRunningIndicatorVisibility({
				isAvatarVisible: true,
				isDesktopLayout: true,
				movementState: PLAYER_STATES.MOVEMENT.WALKING,
			}),
		).toBe(false);
	});

	it("shows the indicator when the player is running on desktop", () => {
		expect(
			resolvePlayerRunningIndicatorVisibility({
				isAvatarVisible: false,
				isDesktopLayout: true,
				movementState: PLAYER_STATES.MOVEMENT.RUNNING,
			}),
		).toBe(true);
	});
});
