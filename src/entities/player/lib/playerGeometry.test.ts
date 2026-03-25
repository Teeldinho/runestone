import { describe, expect, it } from "vitest";

import { PLAYER_ENTITY_CONFIG } from "../config";
import type { PlayerHealthState } from "../model";

import {
	createPlayerMeshSettings,
	getPlayerSpawnPosition,
} from "./playerGeometry";

describe("playerGeometry", () => {
	it("derives player spawn position from origin and y offset", () => {
		const spawnPosition = getPlayerSpawnPosition({
			heightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			origin: [0, 0, 0],
		});

		expect(spawnPosition).toEqual([0, 1.0, 0]);
	});

	it("creates player mesh settings with health-based aura styles", () => {
		const healthState: PlayerHealthState = "alive";

		const meshSettings = createPlayerMeshSettings({
			healthState,
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		expect(meshSettings).toEqual({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 2.0,
			position: [0, 1.0, 0],
		});
	});

	it("maps dead health state to subdued aura settings", () => {
		const meshSettings = createPlayerMeshSettings({
			healthState: "dead",
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		expect(meshSettings.auraColor).toBe("#06090f");
		expect(meshSettings.auraEmissiveIntensity).toBe(0.15);
	});
});
