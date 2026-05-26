export const HOME_TRANSLATION_TONES = {
	ACCENT: "accent",
	PRIMARY: "primary",
	SEALED: "sealed",
} as const;

export type HomeTranslationTone =
	(typeof HOME_TRANSLATION_TONES)[keyof typeof HOME_TRANSLATION_TONES];

export const HOME_TRANSLATION_TONE_CLASS_NAMES = {
	[HOME_TRANSLATION_TONES.ACCENT]: "text-dungeon-gold",
	[HOME_TRANSLATION_TONES.PRIMARY]: "text-panel-title",
	[HOME_TRANSLATION_TONES.SEALED]: "text-dungeon-rune-sealed",
} as const;

export const HOME_TRANSLATION_ARROW_CLASS_NAME = "text-dungeon-gold" as const;

export const HOME_TRANSLATION_RAIL = [
	{
		label: "State",
		target: "Room",
		tone: HOME_TRANSLATION_TONES.PRIMARY,
	},
	{
		label: "Transition",
		target: "Corridor",
		tone: HOME_TRANSLATION_TONES.PRIMARY,
	},
	{
		label: "Guard",
		target: "Locked Door",
		tone: HOME_TRANSLATION_TONES.ACCENT,
	},
	{
		label: "Context",
		target: "Inventory",
		tone: HOME_TRANSLATION_TONES.PRIMARY,
	},
	{
		label: "Actor",
		target: "Loop",
		tone: HOME_TRANSLATION_TONES.PRIMARY,
	},
] as const;
