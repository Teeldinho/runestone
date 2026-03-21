import { convexQuery } from "@convex-dev/react-query";

import { api } from "@/shared/api";

import { SCORE_QUERY_KEYS } from "./queryKeys";

export const scoreQueries = {
	keys: SCORE_QUERY_KEYS,
	leaderboard: (dungeonId: string, limit: number) =>
		convexQuery(api.scores.getDungeonLeaderboard, {
			dungeonId,
			limit,
		}),
} as const;
