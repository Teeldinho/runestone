import { describe, expect, it } from "vitest";

import { PLAYER_MOVEMENT_KEYS } from "@/entities/player";

import { getKeyboardMovementKey } from "./getKeyboardMovementKey";

describe("getKeyboardMovementKey", () => {
	it("maps movement keys and aliases", () => {
		expect(getKeyboardMovementKey("w")).toBe(PLAYER_MOVEMENT_KEYS.FORWARD);
		expect(getKeyboardMovementKey("ArrowUp")).toBe(
			PLAYER_MOVEMENT_KEYS.FORWARD,
		);
		expect(getKeyboardMovementKey("A")).toBe(PLAYER_MOVEMENT_KEYS.LEFT);
		expect(getKeyboardMovementKey("ArrowRight")).toBe(
			PLAYER_MOVEMENT_KEYS.RIGHT,
		);
	});

	it("returns null for unsupported keys", () => {
		expect(getKeyboardMovementKey("Space")).toBeNull();
	});
});
