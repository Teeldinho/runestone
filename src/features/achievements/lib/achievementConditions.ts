import type { DungeonContext } from "@/entities/dungeon";
import { ROOM_IDS } from "@/entities/dungeon";

export const hasReachedLibrary = (ctx: DungeonContext): boolean =>
	ctx.discoveredRooms.includes(ROOM_IDS.LIBRARY);

export const hasCollectedKey = (ctx: DungeonContext): boolean =>
	ctx.hasTreasureKey;

export const hasDefeatedAllEnemies = (ctx: DungeonContext): boolean =>
	ctx.discoveredRooms.includes(ROOM_IDS.GUARD_ROOM) &&
	ctx.enemiesRemaining === 0;
