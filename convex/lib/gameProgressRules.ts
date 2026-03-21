import { BACKEND_ERROR_MESSAGES, GAME_PROGRESS_LIMITS } from "../config";
import type {
	GameProgressId,
	GameProgressSnapshot,
	PersistedGameProgress,
	ProgressSaveResult,
} from "../model/gameProgressTypes";

export const assertSaveSlotRange = (slot: number): void => {
	if (
		slot < GAME_PROGRESS_LIMITS.SAVE_SLOT_MIN ||
		slot > GAME_PROGRESS_LIMITS.SAVE_SLOT_MAX
	) {
		throw new Error(BACKEND_ERROR_MESSAGES.SAVE_SLOT_OUT_OF_BOUNDS);
	}
};

export const createGameProgressSnapshot = (
	progress: PersistedGameProgress,
): GameProgressSnapshot => ({
	id: progress._id,
	userId: progress.userId,
	slot: progress.slot,
	snapshot: progress.snapshot,
	savedAt: progress.savedAt,
});

export const createGameProgressSaveResult = (
	id: GameProgressId,
	savedAt: number,
): ProgressSaveResult => ({
	id,
	savedAt,
});
