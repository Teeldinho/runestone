export const RUNESTONE_LOGO_VARIANTS = {
	DESKTOP: "desktop",
	COMPACT: "compact",
} as const;

export type RunestoneLogoVariant =
	(typeof RUNESTONE_LOGO_VARIANTS)[keyof typeof RUNESTONE_LOGO_VARIANTS];

export const RUNESTONE_LOGO_SEGMENT_IDS = {
	RUNE: "rune",
	STONE: "stone",
} as const;

export type RunestoneLogoSegmentId =
	(typeof RUNESTONE_LOGO_SEGMENT_IDS)[keyof typeof RUNESTONE_LOGO_SEGMENT_IDS];

export const RUNESTONE_LOGO_SEGMENT_CLASS_NAMES = {
	[RUNESTONE_LOGO_SEGMENT_IDS.RUNE]: "text-primary",
	[RUNESTONE_LOGO_SEGMENT_IDS.STONE]: "text-accent",
} as const;
