import type { LeaderboardDisplayEntry } from "@/features/leaderboard";
import { useLeaderboardSnapshot } from "@/features/leaderboard";

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

	const isLoading = snapshot.state === "loading";
	const isError = snapshot.state === "error";
	const isReady = snapshot.state === "ready";
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
