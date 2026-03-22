export type LeaderboardDisplayEntry = {
	rowId: string;
	rankLabel: string;
	playerLabel: string;
	scoreLabel: string;
	runTimeLabel: string;
	roomsDiscoveredLabel: string;
};

export type LeaderboardState = "idle" | "loading" | "ready" | "error";

export type LeaderboardSnapshot = {
	state: LeaderboardState;
	entries: LeaderboardDisplayEntry[];
	errorMessage: string | null;
};
