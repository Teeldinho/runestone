import type { LeaderboardDisplayEntry } from "../lib";

export type LeaderboardState = "idle" | "loading" | "ready" | "error";

export type LeaderboardSnapshot = {
	state: LeaderboardState;
	entries: LeaderboardDisplayEntry[];
	errorMessage: string | null;
};
