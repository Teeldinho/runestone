import { describe, expect, it } from "vitest";
import { ROOM_CONFIG } from "@/shared/config";
import { PLAYER_ENTITY_CONFIG } from "../config/playerConfig";
import { PLAYER_GLTF_CONFIG } from "../config/playerGltfConfig";

const calculatePlayerVisualOffsetY = (
	capsuleHalfHeight: number,
	modelHeightAtScale1: number,
	modelScale: number,
): number => {
	const scaledModelHeight = modelHeightAtScale1 * modelScale;
	const modelHalfHeight = scaledModelHeight / 2;
	return -capsuleHalfHeight + modelHalfHeight;
};

const calculatePlayerSpawnY = (
	capsuleHalfHeight: number,
	colliderTop: number,
): number => {
	return colliderTop + capsuleHalfHeight;
};

const calculateFloorCollider = (
	visualFloorY: number,
	colliderThickness: number,
): { height: number; y: number } => {
	return {
		y: visualFloorY - colliderThickness / 2,
		height: colliderThickness,
	};
};

describe("player spawn position calculations", () => {
	it("calculates visual offset so model feet align with RigidBody bottom", () => {
		const modelHeightAtScale1 = 2.543;
		const modelScale = 0.72;
		const capsuleHalfHeight = 0.55;

		const offset = calculatePlayerVisualOffsetY(
			capsuleHalfHeight,
			modelHeightAtScale1,
			modelScale,
		);

		const scaledHeight = modelHeightAtScale1 * modelScale;
		const expectedOffset = -capsuleHalfHeight + scaledHeight / 2;

		expect(offset).toBeCloseTo(expectedOffset, 3);
		expect(offset).toBeCloseTo(0.365, 2);
	});

	it("calculates spawn Y so player feet are at floor collider top", () => {
		const capsuleHalfHeight = 0.55;
		const colliderTop = 0.1; // -0.1 + 0.2
		const spawnY = calculatePlayerSpawnY(capsuleHalfHeight, colliderTop);

		// spawnY = colliderTop + capsuleHalfHeight = 0.1 + 0.55 = 0.65
		expect(spawnY).toBeCloseTo(0.65, 3);
	});

	it("calculates floor collider position below visual tiles", () => {
		const visualFloorY = 0;
		const colliderThickness = 0.2;

		const collider = calculateFloorCollider(visualFloorY, colliderThickness);

		expect(collider.y).toBeCloseTo(-0.1, 3);
		expect(collider.height).toBe(colliderThickness);
	});

	it("ensures player feet align with floor collider top", () => {
		const capsuleHalfHeight = 0.55;
		const visualFloorY = 0;
		const colliderThickness = 0.2;
		const collider = calculateFloorCollider(visualFloorY, colliderThickness);

		// Spawn Y should be: colliderTop + capsuleHalfHeight
		// This places RigidBody center so capsule bottom touches collider top
		const colliderTop = collider.y + collider.height;
		const expectedSpawnY = colliderTop + capsuleHalfHeight;

		const spawnY = calculatePlayerSpawnY(capsuleHalfHeight, colliderTop);
		expect(spawnY).toBeCloseTo(expectedSpawnY, 3);

		// Verify: capsule bottom = spawnY - capsuleHalfHeight = colliderTop
		const capsuleBottom = spawnY - capsuleHalfHeight;
		expect(capsuleBottom).toBeCloseTo(colliderTop, 3);
	});
});

describe("current config values", () => {
	it("documents current GLTF config values", () => {
		expect(PLAYER_GLTF_CONFIG.CHARACTER.POSITION_Y).toBe(-0.9);
		expect(PLAYER_GLTF_CONFIG.CHARACTER.SCALE).toEqual([0.72, 0.72, 0.72]);
	});

	it("documents current spawn height offset", () => {
		expect(PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET).toBe(0.75);
	});

	it("documents current room/floor config", () => {
		expect(ROOM_CONFIG.HEIGHT).toBe(6);
		expect(ROOM_CONFIG.WIDTH).toBe(12);
	});
});
