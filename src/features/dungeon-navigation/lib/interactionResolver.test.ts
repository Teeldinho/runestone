import { afterEach, describe, expect, it } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import { ENEMY_CONFIG } from "@/shared/config";

import { setDoorwayDetection } from "./doorwayDetectionStore";
import { resolveInteractionCandidates } from "./interactionResolver";

describe("resolveInteractionCandidates", () => {
	afterEach(() => {
		setDoorwayDetection(null);
	});

	describe("key pickup", () => {
		it("returns key candidate when in guard room and key not collected", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[2, 1, 0]],
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
			});

			const keyCandidate =
				result.interact?.type === "key" ? result.interact : null;
			expect(keyCandidate).toBeNull();
		});

		it("returns null interact candidate when not in guard room", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.LIBRARY,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			const keyCandidate =
				result.interact?.type === "key" ? result.interact : null;
			expect(keyCandidate).toBeNull();
		});
	});

	describe("guarded door", () => {
		it("returns guarded door candidate when treasury guard is met", () => {
			setDoorwayDetection({
				eventType: DUNGEON_EVENTS.ENTER_TREASURY,
				doorSide: "south",
				isLocked: false,
			});

			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("guarded-door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_TREASURY);
		});

		it("returns locked feedback when treasury guard is not met", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[2, 1, 0]],
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("key");
		});

		it("returns guarded door for exit when treasury guard is met", () => {
			setDoorwayDetection({
				eventType: DUNGEON_EVENTS.ENTER_EXIT,
				doorSide: "south",
				isLocked: false,
			});

			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.TREASURY,
				hasTreasureKey: true,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("guarded-door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_EXIT);
		});
	});

	describe("unguarded door", () => {
		it("returns unguarded door candidate when near an unguarded door", () => {
			setDoorwayDetection({
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				doorSide: "south",
				isLocked: false,
			});

			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).not.toBeNull();
			expect(result.interact?.type).toBe("door");
			expect(result.interact?.event).toBe(DUNGEON_EVENTS.ENTER_LIBRARY);
		});

		it("returns null when no doorway is detected", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).toBeNull();
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
			});

			expect(result.attack).not.toBeNull();
			expect(result.attack?.distance).toBeCloseTo(0.5, 1);
		});
	});

	describe("priority", () => {
		it("key beats guarded door when both are available", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact?.type).toBe("key");
		});

		it("interact and attack candidates are independent", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: false,
				enemiesRemaining: 1,
				playerPosition: [0, 1, 0],
				enemyPositions: [[0, 1, 0.5]],
			});

			expect(result.interact?.type).toBe("key");
			expect(result.attack).not.toBeNull();
		});
	});

	describe("no candidates", () => {
		it("returns null candidates when nothing is available", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).toBeNull();
			expect(result.attack).toBeNull();
		});

		it("returns null interact when in room with no doors", () => {
			const result = resolveInteractionCandidates({
				currentRoomId: ROOM_IDS.ENTRANCE,
				hasTreasureKey: false,
				enemiesRemaining: 0,
				playerPosition: [0, 1, 0],
				enemyPositions: [],
			});

			expect(result.interact).toBeNull();
		});
	});
});
