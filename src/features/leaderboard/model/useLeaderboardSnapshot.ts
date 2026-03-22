import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { scoreQueries } from "@/entities/score";
import { LEADERBOARD_QUERY_DEFAULTS } from "@/features/leaderboard/config";
import {
	formatLeaderboardEntries,
	getLeaderboardErrorMessage,
} from "@/features/leaderboard/lib";
import type { LeaderboardSnapshot } from "./types";

export const useLeaderboardSnapshot = (): LeaderboardSnapshot => {
	const leaderboardQuery = useQuery(
		scoreQueries.leaderboard(
			LEADERBOARD_QUERY_DEFAULTS.DUNGEON_ID,
			LEADERBOARD_QUERY_DEFAULTS.LIMIT,
		),
	);

	return useMemo(() => {
		if (leaderboardQuery.isPending) {
			return {
				state: "loading",
				entries: [],
				errorMessage: null,
			};
		}

		if (leaderboardQuery.isError) {
			return {
				state: "error",
				entries: [],
				errorMessage: getLeaderboardErrorMessage(leaderboardQuery.error),
			};
		}

		return {
			state: "ready",
			entries: formatLeaderboardEntries(leaderboardQuery.data ?? []),
			errorMessage: null,
		};
	}, [
		leaderboardQuery.data,
		leaderboardQuery.error,
		leaderboardQuery.isError,
		leaderboardQuery.isPending,
	]);
};
