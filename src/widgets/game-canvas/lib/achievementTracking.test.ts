import { describe, expect, it, vi } from "vitest";
import type { RoomId } from "@/entities/dungeon";

const {
	mockHasCollectedKey,
	mockHasDefeatedAllEnemies,
	mockHasEscapedFloor,
	mockHasReachedLibrary,
} = vi.hoisted(() => ({
	mockHasCollectedKey: vi.fn(),
	mockHasDefeatedAllEnemies: vi.fn(),
	mockHasEscapedFloor: vi.fn(),
	mockHasReachedLibrary: vi.fn(),
}));

vi.mock("@/features/achievements", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/achievements")>();

	return {
		...actual,
		hasCollectedKey: mockHasCollectedKey,
		hasDefeatedAllEnemies: mockHasDefeatedAllEnemies,
		hasEscapedFloor: mockHasEscapedFloor,
		hasReachedLibrary: mockHasReachedLibrary,
	};
});

import { ROOM_IDS } from "@/entities/dungeon";
import { ACHIEVEMENT_COPY, ACHIEVEMENT_IDS } from "@/features/achievements";

import {
	createAchievementNotificationPayload,
	resolveAchievementTrackingNotificationIds,
	shouldResetAchievementTracker,
} from "./achievementTracking";

const makeAchievementTrackingContext = (
	discoveredRooms: RoomId[] = [ROOM_IDS.ENTRANCE],
	hasTreasureKey = false,
	enemiesRemaining = 3,
) => ({
	discoveredRooms,
	enemiesRemaining,
	hasTreasureKey,
});

describe("achievementTracking", () => {
	it("resets when the dungeon returns to one discovered room without the key", () => {
		expect(
			shouldResetAchievementTracker({
				currentDiscoveredRoomCount: 1,
				hasTreasureKey: false,
				previousDiscoveredRoomCount: 2,
			}),
		).toBe(true);
	});

	it("does not reset when the key is still held or the run has not expanded", () => {
		expect(
			shouldResetAchievementTracker({
				currentDiscoveredRoomCount: 1,
				hasTreasureKey: true,
				previousDiscoveredRoomCount: 2,
			}),
		).toBe(false);

		expect(
			shouldResetAchievementTracker({
				currentDiscoveredRoomCount: 1,
				hasTreasureKey: false,
				previousDiscoveredRoomCount: 1,
			}),
		).toBe(false);
	});

	it("resolves pending achievement ids in trigger order", () => {
		mockHasReachedLibrary.mockReturnValue(true);
		mockHasCollectedKey.mockReturnValue(true);
		mockHasDefeatedAllEnemies.mockReturnValue(true);
		mockHasEscapedFloor.mockReturnValue(true);

		expect(
			resolveAchievementTrackingNotificationIds({
				achievementTrackingContext: makeAchievementTrackingContext(
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY, ROOM_IDS.GUARD_ROOM],
					true,
					0,
				),
				triggeredAchievementIds: new Set(),
			}),
		).toEqual([
			ACHIEVEMENT_IDS.FIRST_STEPS,
			ACHIEVEMENT_IDS.KEY_HUNTER,
			ACHIEVEMENT_IDS.COMBAT_MASTER,
			ACHIEVEMENT_IDS.ESCAPE_ARTIST,
		]);
	});

	it("skips achievements that were already triggered", () => {
		mockHasReachedLibrary.mockReturnValue(true);
		mockHasCollectedKey.mockReturnValue(true);
		mockHasDefeatedAllEnemies.mockReturnValue(true);
		mockHasEscapedFloor.mockReturnValue(true);

		expect(
			resolveAchievementTrackingNotificationIds({
				achievementTrackingContext: makeAchievementTrackingContext(
					[ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY, ROOM_IDS.GUARD_ROOM],
					true,
					0,
				),
				triggeredAchievementIds: new Set([
					ACHIEVEMENT_IDS.FIRST_STEPS,
					ACHIEVEMENT_IDS.KEY_HUNTER,
				]),
			}),
		).toEqual([ACHIEVEMENT_IDS.COMBAT_MASTER, ACHIEVEMENT_IDS.ESCAPE_ARTIST]);
	});

	it("creates the achievement notification payload from the configured copy", () => {
		expect(
			createAchievementNotificationPayload(ACHIEVEMENT_IDS.ESCAPE_ARTIST),
		).toEqual({
			id: ACHIEVEMENT_IDS.ESCAPE_ARTIST,
			label: ACHIEVEMENT_COPY.ESCAPE_ARTIST.label,
			description: ACHIEVEMENT_COPY.ESCAPE_ARTIST.description,
		});
	});
});
