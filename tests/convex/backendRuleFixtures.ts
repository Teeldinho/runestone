import type { Id } from "../../convex/_generated/dataModel";
import type { PersistedGameProgress } from "../../convex/model/gameProgressTypes";
import type { PersistedDungeonRun } from "../../convex/model/scoreTypes";

const GAME_PROGRESS_ID = "progress-id" as Id<"game_progress">;
const USER_ID = "user-id" as Id<"users">;

const GAME_PROGRESS_RULE_FIXTURE: PersistedGameProgress = {
	_id: GAME_PROGRESS_ID,
	userId: USER_ID,
	slot: 1,
	snapshot: "{}",
	savedAt: 10,
};

const DUNGEON_RUN_RULE_FIXTURE: PersistedDungeonRun = {
	userId: USER_ID,
	username: "Knight",
	discriminator: "#0001",
	dungeonId: "floor-one",
	score: 1200,
	timeMs: 50000,
	roomsDiscovered: 5,
	completedAt: 100,
};

export {
	DUNGEON_RUN_RULE_FIXTURE,
	GAME_PROGRESS_ID,
	GAME_PROGRESS_RULE_FIXTURE,
	USER_ID,
};
