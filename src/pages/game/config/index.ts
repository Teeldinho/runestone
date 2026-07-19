export const GAME_PAGE_COPY = {
	TREASURE_KEY_STATUS: {
		ACQUIRED: "Acquired",
		MISSING: "Missing",
	},
} as const;

export { GAME_PAGE_CONTROLS } from "./gamePageControls";

export const GAME_PAGE_MOBILE_SHEET = {
	HEIGHT_DVH: 90,
	STATECHART_MIN_ZOOM: 1,
	OPEN_BUTTON_LABEL: "Panels",
	TITLE: "Dungeon Observatory",
	DESCRIPTION: "Inspect the live machine and run telemetry.",
	TAB_IDS: {
		STATECHART: "statechart",
		HUD: "hud",
	},
	TAB_LABELS: {
		STATECHART: "Runtime Map",
		HUD: "Run Telemetry",
	},
} as const;

export const GAME_PAGE_PORTRAIT_GATE = {
	TITLE: "Rotate Device",
	DESCRIPTION: "Landscape mode is required on mobile and tablet.",
	BODY: "Rotate your device to landscape to continue playing.",
	HOME_ACTION_LABEL: "Return to landing page",
} as const;

export const GAME_PAGE_SCROLL_LOCK = {
	OVERFLOW_LOCKED: "hidden",
	OVERSCROLL_BEHAVIOR_LOCKED: "none",
} as const;

export const GAME_PAGE_MOBILE_ACTION_PANEL_CLASS_NAMES = {
	ROOT: "pointer-events-auto relative flex shrink-0 flex-col items-end",
	PROMPT_SLOT: "absolute right-0 bottom-full mb-3 flex w-44 flex-col gap-2",
	COMPACT_WIDTH: "w-24",
	TABLET_WIDTH: "w-40",
	CONTROL_STACK: "w-full items-end gap-2",
	COMPACT_CONTROL_STACK: "grid grid-cols-2",
	TABLET_CONTROL_STACK: "flex flex-col",
} as const;

export const GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES = {
	ROOT: "flex w-full flex-col gap-2 empty:hidden",
	BUTTON: "pointer-events-auto relative min-h-11 w-full font-bold",
	BUTTON_LABEL: "block w-full truncate text-center",
	INTERACT_BADGE:
		"absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-dungeon-gold p-0 shadow-[0_0_8px_var(--dungeon-gold)]",
	ATTACK_BADGE:
		"absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-success p-0 shadow-[0_0_8px_var(--success)]",
} as const;

export const GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS = {
	ROOT: "game-page-mobile-touch-actions",
} as const;

export const GAME_PAGE_MOBILE_ACTION_PANEL_TEST_IDS = {
	ROOT: "game-page-mobile-action-panel",
	PROMPT_SLOT: "game-page-mobile-action-panel-prompt-slot",
	CONTROL_STACK: "game-page-mobile-action-panel-control-stack",
} as const;

export const GAME_PAGE_HOME_ACTION_TEST_IDS = {
	ROOT: "game-page-home-action",
} as const;

export const GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS = {
	ROOT: "game-page-mobile-top-bar",
	LEFT_CLUSTER: "game-page-mobile-top-bar-left-cluster",
	RIGHT_CLUSTER: "game-page-mobile-top-bar-right-cluster",
	HP_PANEL: "game-page-mobile-top-bar-hp-panel",
} as const;

export const GAME_PAGE_DESKTOP_HEADER_TEST_IDS = {
	ROOT: "game-page-desktop-header",
	ACTIONS: "game-page-desktop-header-actions",
} as const;

export const GAME_PAGE_MOBILE_OVERLAY_CLASS_NAMES = {
	ROOT: "pointer-events-none absolute right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex items-end gap-2",
	JOYSTICK_ANCHOR:
		"pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-30",
	JOYSTICK_INTERACTIVE_SURFACE: "pointer-events-auto",
	RUN_JUMP_ANCHOR: "flex items-end",
	RUN_JUMP_INTERACTIVE_SURFACE: "pointer-events-auto",
	ACTION_PANEL_ANCHOR: "flex items-end",
} as const;

export const GAME_PAGE_MOBILE_OVERLAY_TEST_IDS = {
	ROOT: "mobile-overlay-row",
	RUN_JUMP_ANCHOR: "mobile-run-jump-anchor",
	ACTION_PANEL_ANCHOR: "mobile-action-panel-anchor",
} as const;
