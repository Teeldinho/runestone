import type { Doc, Id } from "../_generated/dataModel";

type GameProgressId = Id<"game_progress">;
type UserId = Id<"users">;

type PersistedGameProgress = Pick<
	Doc<"game_progress">,
	"_id" | "userId" | "slot" | "snapshot" | "savedAt"
>;

type GameProgressSnapshot = {
	id: GameProgressId;
	userId: UserId;
	slot: number;
	snapshot: string;
	savedAt: number;
};

type ProgressSaveResult = {
	id: GameProgressId;
	savedAt: number;
};

type GetGameProgressByUserAndSlotArgs = {
	userId: UserId;
	slot: number;
};

type SaveGameProgressByUserAndSlotArgs = {
	userId: UserId;
	slot: number;
	snapshot: string;
};

export type {
	GameProgressId,
	GameProgressSnapshot,
	GetGameProgressByUserAndSlotArgs,
	PersistedGameProgress,
	ProgressSaveResult,
	SaveGameProgressByUserAndSlotArgs,
	UserId,
};
