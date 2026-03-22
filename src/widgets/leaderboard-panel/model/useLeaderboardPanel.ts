import type { LeaderboardDisplayEntry } from "@/features/leaderboard";
import {
	LEADERBOARD_STATES,
	useLeaderboardSnapshot,
} from "@/features/leaderboard";

export type LeaderboardPanelViewModel = {
	isLoading: boolean;
	isError: boolean;
	isEmpty: boolean;
	hasEntries: boolean;
	errorMessage: string | null;
	entries: LeaderboardDisplayEntry[];
};

export const useLeaderboardPanel = (): LeaderboardPanelViewModel => {
	const snapshot = useLeaderboardSnapshot();

	const isLoading = snapshot.state === LEADERBOARD_STATES.LOADING;
	const isError = snapshot.state === LEADERBOARD_STATES.ERROR;
	const isReady = snapshot.state === LEADERBOARD_STATES.READY;
	const hasEntries = isReady && snapshot.entries.length > 0;
	const isEmpty = isReady && snapshot.entries.length === 0;

	return {
		isLoading,
		isError,
		isEmpty,
		hasEntries,
		errorMessage: snapshot.errorMessage,
		entries: snapshot.entries,
	};
};
