import type { Doc, Id } from "../_generated/dataModel";

type UserId = Id<"users">;
type DungeonRunId = Id<"dungeon_runs">;

type PersistedDungeonRun = Pick<
	Doc<"dungeon_runs">,
	| "userId"
	| "username"
	| "discriminator"
	| "dungeonId"
	| "score"
	| "timeMs"
	| "roomsDiscovered"
	| "completedAt"
>;

type ScoreEntry = {
	userId: UserId;
	username: string;
	discriminator: string;
	floorId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
	completedAt: number;
};

type GetDungeonLeaderboardArgs = {
	dungeonId: string;
	limit: number;
};

type SubmitDungeonRunScoreArgs = {
	userId: UserId;
	dungeonId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
};

type SubmitDungeonRunScoreResult = {
	runId: DungeonRunId;
	completedAt: number;
};

export type {
	DungeonRunId,
	GetDungeonLeaderboardArgs,
	PersistedDungeonRun,
	ScoreEntry,
	SubmitDungeonRunScoreArgs,
	SubmitDungeonRunScoreResult,
	UserId,
};
