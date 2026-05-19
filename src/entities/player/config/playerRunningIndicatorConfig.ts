export const PLAYER_RUNNING_INDICATOR_COPY = {
	LABEL: "Running",
} as const;

export const PLAYER_RUNNING_INDICATOR_CONFIG = {
	POSITION: [0, 2.1, 0] as const,
	DISTANCE_FACTOR: 12,
	DOM_Z_INDEX_RANGE: [8, 0] as const,
} as const;

export const PLAYER_RUNNING_INDICATOR_CLASS_NAMES = {
	ROOT: "pointer-events-none absolute right-4 bottom-4 z-30",
	BADGE:
		"border-dungeon-gold bg-[color-mix(in_srgb,var(--dungeon-gold)_12%,transparent)] px-2 py-0.5 text-[0.56rem] font-semibold tracking-[0.24em] text-dungeon-gold",
	ICON: "size-3",
} as const;
