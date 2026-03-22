export const SCORE_QUERY_KEY_ROOT = "scores";

export const SCORE_QUERY_KEYS = {
	ALL: [SCORE_QUERY_KEY_ROOT] as const,
	LEADERBOARD: (dungeonId: string, limit: number) =>
		[SCORE_QUERY_KEY_ROOT, "leaderboard", dungeonId, limit] as const,
} as const;
