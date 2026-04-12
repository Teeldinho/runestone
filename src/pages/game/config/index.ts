export const GAME_PAGE_COPY = {
	TREASURE_KEY_STATUS: {
		ACQUIRED: "Acquired",
		MISSING: "Missing",
	},
} as const;

export const GAME_PAGE_LAYOUT = {
	DETAILS_PANEL_HEIGHT_DVH: 35,
	DESKTOP_LEFT_PANE_WIDTH_REM: 24,
	DESKTOP_RIGHT_PANE_WIDTH_REM: 22,
} as const;

export const GAME_PAGE_MOBILE_SHEET = {
	HEIGHT_DVH: 90,
	OPEN_BUTTON_LABEL: "Panels",
	TITLE: "Game Surfaces",
	DESCRIPTION: "Open the state visualizer and HUD panels.",
	TAB_IDS: {
		STATECHART: "statechart",
		HUD: "hud",
	},
	TAB_LABELS: {
		STATECHART: "Statechart",
		HUD: "HUD",
	},
} as const;
