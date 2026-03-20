import type { ScoreEntry } from "@/entities/score";

export type LeaderboardState = "idle" | "loading" | "ready" | "error";

export type LeaderboardSnapshot = {
	state: LeaderboardState;
	entries: ScoreEntry[];
	errorMessage: string | null;
};
