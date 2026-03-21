import type { Doc, Id } from "../_generated/dataModel";
import { BACKEND_ERROR_MESSAGES, GAME_PROGRESS_LIMITS } from "../config";

type PersistedGameProgress = Pick<
	Doc<"game_progress">,
	"_id" | "userId" | "slot" | "snapshot" | "savedAt"
>;

type GameProgressSnapshot = {
	id: Id<"game_progress">;
	userId: Id<"users">;
	slot: number;
	snapshot: string;
	savedAt: number;
};

type ProgressSaveResult = {
	id: Id<"game_progress">;
	savedAt: number;
};

export const assertSaveSlotRange = (slot: number): void => {
	if (
		slot < GAME_PROGRESS_LIMITS.SAVE_SLOT_MIN ||
		slot > GAME_PROGRESS_LIMITS.SAVE_SLOT_MAX
	) {
		throw new Error(BACKEND_ERROR_MESSAGES.SAVE_SLOT_OUT_OF_BOUNDS);
	}
};

export const createProgressSnapshot = (
	progress: PersistedGameProgress,
): GameProgressSnapshot => ({
	id: progress._id,
	userId: progress.userId,
	slot: progress.slot,
	snapshot: progress.snapshot,
	savedAt: progress.savedAt,
});

export const createProgressSaveResult = (
	id: Id<"game_progress">,
	savedAt: number,
): ProgressSaveResult => ({
	id,
	savedAt,
});

export type { GameProgressSnapshot, PersistedGameProgress, ProgressSaveResult };
