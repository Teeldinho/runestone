export const LEADERBOARD_PANEL_IDS = {
	ROOT: "leaderboard-panel-heading",
} as const;

export const LEADERBOARD_PANEL_COPY = {
	TITLE: "Leaderboard",
	DESCRIPTION: "Top floor-one runs synced from Convex.",
	STATE: {
		LOADING: "Loading leaderboard runs...",
		EMPTY: "No runs submitted yet. Complete a dungeon run to claim the board.",
		ERROR_FALLBACK: "Leaderboard data is unavailable right now.",
	},
	TABLE: {
		CAPTION: "Top dungeon runs sorted by score.",
		HEADERS: {
			RANK: "Rank",
			PLAYER: "Player",
			SCORE: "Score",
			TIME: "Run Time",
			ROOMS: "Rooms",
		},
	},
} as const;
