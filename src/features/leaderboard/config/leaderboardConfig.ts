import { FLOOR_IDS } from "@/entities/dungeon";

export const LEADERBOARD_QUERY_DEFAULTS = {
	DUNGEON_ID: FLOOR_IDS.FLOOR_ONE,
	LIMIT: 10,
} as const;

export const LEADERBOARD_DISPLAY_FORMAT = {
	NUMBER_LOCALE: "en-US",
	RANK_PREFIX: "#",
	ROW_ID_SEPARATOR: ":",
} as const;

export const LEADERBOARD_TIME_UNITS = {
	MILLISECONDS_PER_SECOND: 1000,
	SECONDS_PER_MINUTE: 60,
} as const;

export const LEADERBOARD_ROOMS_COPY = {
	SINGULAR: "room",
	PLURAL: "rooms",
} as const;
