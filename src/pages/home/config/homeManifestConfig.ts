export const HOME_MANIFEST_TONES = {
	ACTIVE: "active",
	AVAILABLE: "available",
	SEALED: "sealed",
} as const;

export type HomeManifestTone =
	(typeof HOME_MANIFEST_TONES)[keyof typeof HOME_MANIFEST_TONES];

export const HOME_MANIFEST_TONE_CLASS_NAMES = {
	[HOME_MANIFEST_TONES.ACTIVE]: "text-dungeon-gold",
	[HOME_MANIFEST_TONES.AVAILABLE]: "text-dungeon-gold",
	[HOME_MANIFEST_TONES.SEALED]: "text-dungeon-rune-sealed",
} as const;

export const HOME_MANIFEST_FOCUS_ITEM = {
	badge: "Guard Condition",
	description:
		"Evaluates context before allowing passage. If the key is missing, the path stays blocked.",
	title: "Locked Door",
	tone: HOME_MANIFEST_TONES.SEALED,
} as const;

export const HOME_MANIFEST_NODES = [
	{
		description: "Initialize run",
		id: "entrance",
		title: "Entrance",
		tone: HOME_MANIFEST_TONES.ACTIVE,
	},
	{
		description: "Transition",
		id: "corridor",
		title: "Corridor",
		tone: HOME_MANIFEST_TONES.AVAILABLE,
	},
	{
		description: "Guard condition",
		id: "locked-door",
		title: "Locked Door",
		tone: HOME_MANIFEST_TONES.SEALED,
	},
	{
		description: "Use context",
		id: "inventory",
		title: "Inventory",
		tone: HOME_MANIFEST_TONES.AVAILABLE,
	},
] as const;
