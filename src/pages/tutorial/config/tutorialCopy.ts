export const TUTORIAL_TAB_IDS = {
	CONTROLS: "controls",
	FIRST_RUN: "first-run",
} as const;

export type TutorialTabId =
	(typeof TUTORIAL_TAB_IDS)[keyof typeof TUTORIAL_TAB_IDS];

export const TUTORIAL_COPY = {
	CTA_LABEL: "Enter Dungeon",
	HEADING: "Manual",
	SUBTITLE:
		"Navigate the functional structure of the playable architecture. Understand state transitions, entity data, and traversal paths.",
} as const;

export const TUTORIAL_TABS = [
	{
		id: TUTORIAL_TAB_IDS.CONTROLS,
		label: "Controls",
	},
	{
		id: TUTORIAL_TAB_IDS.FIRST_RUN,
		label: "First Run",
	},
] as const;

export const TUTORIAL_CONTROLS_COPY = {
	SECTION_HEADING: "Controls",
	SECTION_DESCRIPTION:
		"Master the tactile interface to navigate the architecture.",
	MOVEMENT_HEADING: "Movement",
	ACTIONS_HEADING: "Actions",
	CAMERA_HEADING: "Camera modes",
} as const;

export const TUTORIAL_CONTROL_GROUPS = [
	{
		heading: TUTORIAL_CONTROLS_COPY.MOVEMENT_HEADING,
		rows: [
			{
				label: "Move",
				mobileIcon: "Gamepad2",
				mobileLabel: "Left joystick",
				shortcuts: ["W", "A", "S", "D"],
			},
			{
				label: "Run toggle",
				mobileIcon: "Footprints",
				mobileLabel: "Footprints button",
				shortcuts: ["Shift"],
			},
			{
				label: "Jump",
				mobileIcon: "ChevronsUp",
				mobileLabel: "Chevrons-up button",
				shortcuts: ["Space"],
			},
		],
		tone: "primary",
	},
	{
		heading: TUTORIAL_CONTROLS_COPY.ACTIONS_HEADING,
		rows: [
			{
				label: "Interact",
				shortcuts: ["E"],
			},
			{
				label: "Attack",
				shortcuts: ["F"],
			},
		],
		tone: "accent",
	},
] as const;

export const TUTORIAL_CAMERA_MODES = [
	{
		code: "3P",
		key: "1",
		label: "3rd Person",
		tone: "primary",
	},
	{
		code: "TD",
		key: "2",
		label: "Top Down",
		tone: "primary",
	},
	{
		code: "1P",
		key: "3",
		label: "1st Person",
		tone: "primary",
	},
	{
		code: "FO",
		key: "4",
		label: "Free Orbital",
		tone: "primary",
	},
] as const;

export const TUTORIAL_FIRST_RUN_COPY = {
	SECTION_HEADING: "First run path",
} as const;

export const TUTORIAL_FIRST_RUN_TONE_CLASS_NAMES = {
	accent: "text-dungeon-gold",
	primary: "text-dungeon-gold",
	sealed: "text-dungeon-rune-sealed",
	success: "text-success",
} as const;

export const TUTORIAL_FIRST_RUN_STEPS = [
	{
		detail:
			"Mount the run at Entrance, hydrate the active room, and publish the initial state snapshot.",
		label: "Enter the initial state",
		tokens: [
			{
				label: "ENTRANCE",
				tone: "primary",
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
				tone: "accent",
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
				tone: "sealed",
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
				tone: "accent",
			},
			{
				label: "INVENTORY",
				tone: "primary",
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
				tone: "success",
			},
		],
	},
] as const;
