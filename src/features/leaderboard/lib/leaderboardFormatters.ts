import type { ScoreEntry } from "@/entities/score";

import {
	LEADERBOARD_DISPLAY_FORMAT,
	LEADERBOARD_ERROR_MESSAGES,
	LEADERBOARD_ROOMS_COPY,
	LEADERBOARD_TIME_UNITS,
} from "../config";

type LeaderboardDisplayEntry = {
	rowId: string;
	rankLabel: string;
	playerLabel: string;
	scoreLabel: string;
	runTimeLabel: string;
	roomsDiscoveredLabel: string;
};

const getRoomsDiscoveredLabel = (roomsDiscovered: number): string => {
	const roomWord =
		roomsDiscovered === 1
			? LEADERBOARD_ROOMS_COPY.SINGULAR
			: LEADERBOARD_ROOMS_COPY.PLURAL;

	return `${roomsDiscovered.toLocaleString(LEADERBOARD_DISPLAY_FORMAT.NUMBER_LOCALE)} ${roomWord}`;
};

export const formatRunDurationLabel = (timeMs: number): string => {
	const totalSeconds = Math.floor(
		timeMs / LEADERBOARD_TIME_UNITS.MILLISECONDS_PER_SECOND,
	);
	const minutes = Math.floor(
		totalSeconds / LEADERBOARD_TIME_UNITS.SECONDS_PER_MINUTE,
	);
	const seconds = totalSeconds % LEADERBOARD_TIME_UNITS.SECONDS_PER_MINUTE;

	return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
};

export const formatLeaderboardEntries = (
	entries: ScoreEntry[],
): LeaderboardDisplayEntry[] => {
	return entries.map((entry, index) => ({
		rowId: `${entry.userId}${LEADERBOARD_DISPLAY_FORMAT.ROW_ID_SEPARATOR}${entry.completedAt}`,
		rankLabel: `${LEADERBOARD_DISPLAY_FORMAT.RANK_PREFIX}${index + 1}`,
		playerLabel: `${entry.username}${entry.discriminator}`,
		scoreLabel: entry.score.toLocaleString(
			LEADERBOARD_DISPLAY_FORMAT.NUMBER_LOCALE,
		),
		runTimeLabel: formatRunDurationLabel(entry.timeMs),
		roomsDiscoveredLabel: getRoomsDiscoveredLabel(entry.roomsDiscovered),
	}));
};

export const getLeaderboardErrorMessage = (error: unknown): string => {
	if (error instanceof Error && error.message.length > 0) {
		return error.message;
	}

	return LEADERBOARD_ERROR_MESSAGES.LOAD_FAILED;
};

export type { LeaderboardDisplayEntry };
