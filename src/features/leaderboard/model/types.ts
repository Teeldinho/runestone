import type { LEADERBOARD_STATES } from "../config";

export type LeaderboardDisplayEntry = {
	rowId: string;
	rankLabel: string;
	playerLabel: string;
	scoreLabel: string;
	runTimeLabel: string;
	roomsDiscoveredLabel: string;
};

export type LeaderboardState =
	(typeof LEADERBOARD_STATES)[keyof typeof LEADERBOARD_STATES];

export type LeaderboardSnapshot = {
	state: LeaderboardState;
	entries: LeaderboardDisplayEntry[];
	errorMessage: string | null;
};
