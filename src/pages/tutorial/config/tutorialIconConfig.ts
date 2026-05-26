export const TUTORIAL_ICON_KEYS = {
	CHEVRONS_UP: "chevrons-up",
	FOOTPRINTS: "footprints",
	GAMEPAD: "gamepad",
} as const;

export type TutorialIconKey =
	(typeof TUTORIAL_ICON_KEYS)[keyof typeof TUTORIAL_ICON_KEYS];
