import { describe, expect, it } from "vitest";

import { PLAYER_ENTITY_CONFIG } from "../config";

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

		expect(spawnPosition).toEqual([
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		]);
	});

	it("creates player mesh settings from the origin", () => {
		const meshSettings = createPlayerMeshSettings({
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		expect(meshSettings).toEqual({
			position: [0, PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET, 0],
		});
	});
});
