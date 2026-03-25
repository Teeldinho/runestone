import { describe, expect, it } from "vitest";

import { PLAYER_ANIMATION_NAMES } from "../config/playerGltfConfig";
import { PLAYER_STATES } from "../config";

import { selectPlayerAnimation } from "./selectPlayerAnimation";

describe("selectPlayerAnimation", () => {
	it("returns Death_A when health state is dead", () => {
		expect(
			selectPlayerAnimation([0, 0, 0], false, PLAYER_STATES.HEALTH.DEAD),
		).toBe(PLAYER_ANIMATION_NAMES.DEATH);
	});

	it("returns Idle_A when not moving", () => {
		expect(
			selectPlayerAnimation([0, 0, 0], false, PLAYER_STATES.HEALTH.ALIVE),
		).toBe(PLAYER_ANIMATION_NAMES.IDLE);
	});

	it("returns Walking_A when moving without sprinting", () => {
		expect(
			selectPlayerAnimation([1, 0, 0], false, PLAYER_STATES.HEALTH.ALIVE),
		).toBe(PLAYER_ANIMATION_NAMES.WALK);
	});

	it("returns Running_A when moving and sprinting", () => {
		expect(
			selectPlayerAnimation([0, 0, -1], true, PLAYER_STATES.HEALTH.ALIVE),
		).toBe(PLAYER_ANIMATION_NAMES.RUN);
	});

	it("returns Death_A regardless of velocity when dead", () => {
		expect(
			selectPlayerAnimation([1, 0, 1], true, PLAYER_STATES.HEALTH.DEAD),
		).toBe(PLAYER_ANIMATION_NAMES.DEATH);
	});
});
