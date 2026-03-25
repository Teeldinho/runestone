import { describe, expect, it } from "vitest";

import { ENEMY_ANIMATION_NAMES } from "../config/enemyGltfConfig";
import { ENEMY_MACHINE_STATES } from "../config";

import { selectEnemyAnimation } from "./selectEnemyAnimation";

describe("selectEnemyAnimation", () => {
	it("returns Idle_A for idle state", () => {
		expect(selectEnemyAnimation(ENEMY_MACHINE_STATES.PATROL)).toBe(
			ENEMY_ANIMATION_NAMES.WALK,
		);
	});

	it("returns Running_A for chase state", () => {
		expect(selectEnemyAnimation(ENEMY_MACHINE_STATES.CHASE)).toBe(
			ENEMY_ANIMATION_NAMES.RUN,
		);
	});

	it("returns attack animation for attack state", () => {
		expect(selectEnemyAnimation(ENEMY_MACHINE_STATES.ATTACK)).toBe(
			ENEMY_ANIMATION_NAMES.ATTACK,
		);
	});

	it("returns Death_A for dead state", () => {
		expect(selectEnemyAnimation(ENEMY_MACHINE_STATES.DEAD)).toBe(
			ENEMY_ANIMATION_NAMES.DEATH,
		);
	});

	it("returns Idle_A for unknown state", () => {
		expect(selectEnemyAnimation("unknown")).toBe(ENEMY_ANIMATION_NAMES.IDLE);
	});
});
