import { describe, expect, it } from "vitest";

import { PLAYER_MOVEMENT_KEYS } from "@/entities/player";

import { resolveKeyboardMovementVelocity } from "./resolveKeyboardMovementVelocity";

describe("resolveKeyboardMovementVelocity", () => {
	it("combines pressed movement keys into a velocity vector", () => {
		expect(
			resolveKeyboardMovementVelocity({
				pressedKeys: new Set([
					PLAYER_MOVEMENT_KEYS.FORWARD,
					PLAYER_MOVEMENT_KEYS.RIGHT,
				]),
			}),
		).toEqual([1, 0, -1]);
	});

	it("returns a zero vector when nothing is pressed", () => {
		expect(
			resolveKeyboardMovementVelocity({
				pressedKeys: new Set(),
			}),
		).toEqual([0, 0, 0]);
	});
});
