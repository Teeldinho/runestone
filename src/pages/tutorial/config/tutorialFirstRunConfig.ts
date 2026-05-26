export const TUTORIAL_FIRST_RUN_TONES = {
	ACCENT: "accent",
	PRIMARY: "primary",
	SEALED: "sealed",
	SUCCESS: "success",
} as const;

export type TutorialFirstRunTone =
	(typeof TUTORIAL_FIRST_RUN_TONES)[keyof typeof TUTORIAL_FIRST_RUN_TONES];

export const TUTORIAL_FIRST_RUN_TONE_CLASS_NAMES = {
	[TUTORIAL_FIRST_RUN_TONES.ACCENT]: "text-dungeon-gold",
	[TUTORIAL_FIRST_RUN_TONES.PRIMARY]: "text-dungeon-gold",
	[TUTORIAL_FIRST_RUN_TONES.SEALED]: "text-dungeon-rune-sealed",
	[TUTORIAL_FIRST_RUN_TONES.SUCCESS]: "text-success",
} as const;

export const TUTORIAL_FIRST_RUN_STEPS = [
	{
		detail:
			"Mount the run at Entrance, hydrate the active room, and publish the initial state snapshot.",
		label: "Enter the initial state",
		tokens: [
			{
				label: "ENTRANCE",
				tone: TUTORIAL_FIRST_RUN_TONES.PRIMARY,
			},
		],
	},
	{
		detail:
			"Emit a movement event; the corridor transition resolves before the next room becomes active.",
		label: "Dispatch movement events",
		tokens: [
			{
				label: "CORRIDORS",
				tone: TUTORIAL_FIRST_RUN_TONES.ACCENT,
			},
		],
	},
	{
		detail:
			"Evaluate the guard against keys and blockers; the path stays sealed until the predicate passes.",
		label: "Satisfy guards",
		tokens: [
			{
				label: "KEYS / BLOCKERS",
				tone: TUTORIAL_FIRST_RUN_TONES.SEALED,
			},
		],
	},
	{
		detail:
			"Mutate combat state and inventory, then recalculate which transitions remain valid.",
		label: "Resolve combat and context",
		tokens: [
			{
				label: "ENEMY STATE",
				tone: TUTORIAL_FIRST_RUN_TONES.ACCENT,
			},
			{
				label: "INVENTORY",
				tone: TUTORIAL_FIRST_RUN_TONES.PRIMARY,
			},
		],
	},
	{
		detail:
			"Write the terminal floor state and close the run once the final room resolves.",
		label: "Reach the final state",
		tokens: [
			{
				label: "COMPLETE FLOOR",
				tone: TUTORIAL_FIRST_RUN_TONES.SUCCESS,
			},
		],
	},
] as const;
