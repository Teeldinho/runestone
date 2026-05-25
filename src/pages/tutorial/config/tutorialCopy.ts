export const TUTORIAL_TAB_IDS = {
	CONTROLS: "controls",
	FIRST_RUN: "first-run",
	CONCEPTS: "concepts",
} as const;

export type TutorialTabId =
	(typeof TUTORIAL_TAB_IDS)[keyof typeof TUTORIAL_TAB_IDS];

export const TUTORIAL_COPY = {
	CTA_LABEL: "Enter Dungeon",
	HEADING: "Play the system.",
	SUBTITLE:
		"Learn the controls, then read the dungeon as a living statechart: every room, lock, enemy, and camera shift reflects a deliberate system transition.",
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
	{
		id: TUTORIAL_TAB_IDS.CONCEPTS,
		label: "Concepts",
	},
] as const;

export const TUTORIAL_CONTROLS_COPY = {
	SECTION_HEADING: "Controls",
	DESKTOP_HEADING: "Desktop controls",
	MOBILE_TABLET_HEADING: "Mobile and tablet controls",
} as const;

export const TUTORIAL_DESKTOP_CONTROLS = [
	{
		detail: "WASD / Arrows — Move",
		label: "Movement",
	},
	{
		detail: "Shift — Run toggle",
		label: "Run",
	},
	{
		detail: "Space — Jump",
		label: "Jump",
	},
	{
		detail: "E — Interact",
		label: "Interact",
	},
	{
		detail: "F — Attack",
		label: "Attack",
	},
	{
		detail: "1 / 3P — Third Person",
		label: "Camera modes",
	},
	{
		detail: "2 / TD — Top Down",
		label: "Camera modes",
	},
	{
		detail: "3 / 1P — First Person",
		label: "Camera modes",
	},
	{
		detail: "4 / FO — Free Orbital",
		label: "Camera modes",
	},
] as const;

export const TUTORIAL_MOBILE_CONTROLS = [
	{
		detail: "Left joystick — Move",
		label: "Movement",
	},
	{
		detail: "Right touch zone — Look",
		label: "Look",
	},
	{
		detail: "Footprints button — Run toggle",
		label: "Run",
	},
	{
		detail: "Chevrons-up button — Jump",
		label: "Jump",
	},
	{
		detail: "Prompt button — Interact or Attack when available",
		label: "Context action",
	},
	{
		detail: "Panels button — Open game panels",
		label: "Panels",
	},
	{
		detail: "Settings button — Open settings",
		label: "Settings",
	},
] as const;

export const TUTORIAL_FIRST_RUN_COPY = {
	SECTION_HEADING: "First run path",
} as const;

export const TUTORIAL_FIRST_RUN_STEPS = [
	{
		detail: "Start in the Entrance and observe the active room.",
		label: "Enter the initial state",
	},
	{
		detail: "Move through corridors to request transitions.",
		label: "Dispatch movement events",
	},
	{
		detail: "Collect keys or clear blockers before locked paths open.",
		label: "Satisfy guards",
	},
	{
		detail: "Enemy state and inventory change available transitions.",
		label: "Resolve combat and context",
	},
	{
		detail: "Complete the floor and inspect the state path.",
		label: "Reach the final state",
	},
] as const;

export const TUTORIAL_CONCEPTS_COPY = {
	SECTION_HEADING: "Concepts in play",
} as const;

export const TUTORIAL_CONCEPT_ROWS = [
	{
		detail: "The current state is represented as the room the player occupies.",
		label: "State → Room",
		monoLabel: "current: Entrance",
	},
	{
		detail:
			"A valid transition appears as a corridor or doorway between rooms.",
		label: "Transition → Corridor",
		monoLabel: "event: ENTER_LIBRARY",
	},
	{
		detail:
			"Movement, interaction, attack, run, and jump actions dispatch events.",
		label: "Event → Input or prompt",
		monoLabel: "event: ENTER_LIBRARY",
	},
	{
		detail:
			"Locked doors, keys, enemies, and room conditions make those rules visible.",
		label: "Guard → Lock or key condition",
		monoLabel: "guard: hasTreasureKey",
	},
	{
		detail:
			"Keys, HP, current room, and discovered rooms can change what paths are available.",
		label: "Context → Inventory, HP, current room",
		monoLabel: "context.hp: 100",
	},
	{
		detail:
			"Actors process events independently while the dungeon run continues.",
		label: "Actor → Camera, player, input, audio",
		monoLabel: "actor.camera: 3P",
	},
] as const;
