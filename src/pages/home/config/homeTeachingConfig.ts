import { HOME_TEACHING_ICON_KEYS } from "./homeTeachingIconConfig";

export const HOME_TEACHING_TONES = {
	ACCENT: "accent",
	PRIMARY: "primary",
	SEALED: "sealed",
} as const;

export type HomeTeachingTone =
	(typeof HOME_TEACHING_TONES)[keyof typeof HOME_TEACHING_TONES];

export const HOME_TEACHING_TONE_CLASS_NAMES = {
	[HOME_TEACHING_TONES.ACCENT]: "text-dungeon-gold",
	[HOME_TEACHING_TONES.PRIMARY]: "text-dungeon-gold",
	[HOME_TEACHING_TONES.SEALED]: "text-dungeon-rune-sealed",
} as const;

export const HOME_TEACHING_FEATURES = [
	{
		description:
			"Each state becomes a distinct room with one clear point of occupancy.",
		iconKey: HOME_TEACHING_ICON_KEYS.DOOR_OPEN,
		id: "states-become-rooms",
		title: "States become rooms",
		tone: HOME_TEACHING_TONES.PRIMARY,
	},
	{
		description:
			"Events are actions that open the next corridor when they resolve.",
		iconKey: HOME_TEACHING_ICON_KEYS.ZAP,
		id: "events-move-system",
		title: "Events move the system",
		tone: HOME_TEACHING_TONES.ACCENT,
	},
	{
		description:
			"Guards stop traversal until the required state or inventory is present.",
		iconKey: HOME_TEACHING_ICON_KEYS.LOCK,
		id: "guards-control-progression",
		title: "Guards control progression",
		tone: HOME_TEACHING_TONES.SEALED,
	},
	{
		description:
			"Actors run their own loops and stay isolated from the main machine.",
		iconKey: HOME_TEACHING_ICON_KEYS.WORKFLOW,
		id: "actors-stay-isolated",
		title: "Actors stay isolated",
		tone: HOME_TEACHING_TONES.PRIMARY,
	},
	{
		description:
			"Inventory, HP, and current room data shape which paths remain valid.",
		iconKey: HOME_TEACHING_ICON_KEYS.PACKAGE,
		id: "context-changes-paths",
		title: "Context changes paths",
		tone: HOME_TEACHING_TONES.PRIMARY,
	},
] as const;
