import { describe, expect, it } from "vitest";

import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	DUNGEON_INTERACTABLE_IDS,
	ROOM_IDS,
} from "@/entities/dungeon";
import { ENEMY_CONFIG } from "@/shared/config";

import { resolveInteractionCandidates } from "./interactionResolver";

const defaultCandidates = {
	nearInteractable: null,
};

describe("resolveInteractionCandidates", () => {
	describe("key pickup", () => {
		it("returns key candidate only when the treasure key is the nearby interactable", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[2, 1, 0]],
				nearInteractable: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("key");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.PICK_UP_KEY);
		});

		it("returns null interact candidate when key already collected", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[2, 1, 0]],
				nearInteractable: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			});

			expect(result.interact).toBeNull();
		});

		it("returns null interact candidate when not in guard room", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.LIBRARY,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				nearInteractable: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			});

			expect(result.interact).toBeNull();
		});
	});

	describe("doors", () => {
		it("returns guarded door candidate when treasury guard is satisfied", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("guarded-door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_TREASURY);
			expect(result.interact?.prompt).toBe("Enter Treasury");
		});

		it("dispatches locked doorway feedback with locked prompt copy when guard is unmet", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("guarded-door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT);
			expect(result.interact?.prompt).toBe("Locked");
		});

		it("returns exit candidate when the treasury exit is nearby and unlocked", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.TREASURY,
				hasTreasureKey: true,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				nearInteractable: buildDoorKey(ROOM_IDS.TREASURY, DOOR_SIDES.SOUTH),
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("exit");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_EXIT);
			expect(result.interact?.prompt).toBe("Exit Floor");
		});

		it("returns unguarded door candidate when near an unguarded door", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				nearInteractable: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_LIBRARY);
		});
	});

	describe("attack candidate", () => {
		it("returns attack candidate when enemy is within attack radius", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[0, 1, ENEMY_CONFIG.ATTACK_RADIUS - 0.1]],
				...defaultCandidates,
			});

			expect(result.attack).not.toBeNull();
			expect(result.attack?.type).toBe("enemy");
		});

		it("returns null attack candidate when enemy is outside attack radius", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[0, 1, ENEMY_CONFIG.ATTACK_RADIUS + 1]],
				...defaultCandidates,
			});

			expect(result.attack).toBeNull();
		});

		it("returns null attack candidate when no enemies remain", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				...defaultCandidates,
			});

			expect(result.attack).toBeNull();
		});

		it("returns null attack candidate when not in guard room", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.LIBRARY,
				hasTreasureKey: true,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				...defaultCandidates,
			});

			expect(result.attack).toBeNull();
		});

		it("returns nearest enemy when multiple enemies are nearby", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 2,
				playerPosition: [0, 1, 0],
				enemyPositions: [
					[0, 1, 0.5],
					[0, 1, 1.0],
				],
				...defaultCandidates,
			});

			expect(result.attack).not.toBeNull();
			expect(result.attack?.distance).toBeCloseTo(0.5, 1);
		});
	});

	describe("target consistency", () => {
		it("keeps interact and attack candidates independent", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[0, 1, 0.5]],
				nearInteractable: DUNGEON_INTERACTABLE_IDS.TREASURE_KEY,
			});

			expect(result.interact?.type).toBe("key");
			expect(result.attack).not.toBeNull();
		});

		it("returns null candidates when nothing is available", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
				...defaultCandidates,
			});

			expect(result.interact).toBeNull();
			expect(result.attack).toBeNull();
		});
	});
});
