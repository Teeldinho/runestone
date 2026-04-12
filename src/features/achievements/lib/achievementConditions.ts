import type { DungeonContext } from "@/entities/dungeon";
import { ROOM_IDS } from "@/entities/dungeon";

type AchievementTrackingContext = Pick<
	DungeonContext,
	"discoveredRooms" | "enemiesRemaining" | "hasTreasureKey"
>;

export const hasReachedLibrary = (ctx: AchievementTrackingContext): boolean =>
	ctx.discoveredRooms.includes(ROOM_IDS.LIBRARY);

export const hasCollectedKey = (ctx: AchievementTrackingContext): boolean =>
	ctx.hasTreasureKey;

export const hasDefeatedAllEnemies = (
	ctx: AchievementTrackingContext,
): boolean =>
	ctx.discoveredRooms.includes(ROOM_IDS.GUARD_ROOM) &&
	ctx.enemiesRemaining === 0;

export const hasEscapedFloor = (ctx: AchievementTrackingContext): boolean =>
	ctx.discoveredRooms.includes(ROOM_IDS.EXIT);
