export const GAME_PAGE_COPY = {
	TREASURE_KEY_STATUS: {
		ACQUIRED: "Acquired",
		MISSING: "Missing",
	},
} as const;

export const GAME_PAGE_LAYOUT = {
	DETAILS_PANEL_HEIGHT_CLASS_NAME: "h-[35dvh]",
	DETAILS_PANEL_MAX_HEIGHT_CLASS_NAME: "max-h-[35dvh]",
	DESKTOP_LEFT_PANE_WIDTH_CLASS_NAME: "lg:w-[24rem]",
	DESKTOP_RIGHT_PANE_WIDTH_CLASS_NAME: "lg:w-[22rem]",
} as const;

export const GAME_PAGE_MOBILE_SHEET = {
	HEIGHT_DVH: 90,
	HEIGHT_CLASS_NAME: "h-[90dvh]",
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

export const GAME_PAGE_SCROLL_LOCK = {
	OVERFLOW_LOCKED: "hidden",
	OVERSCROLL_BEHAVIOR_LOCKED: "none",
} as const;
