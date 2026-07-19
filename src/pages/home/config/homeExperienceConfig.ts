export const HOME_SECTION_IDS = {
	HOW_IT_WORKS: "how-it-works",
	MACHINE: "machine",
	CONTROLS: "controls",
} as const;

export const HOME_FIELD_GUIDE_VALUES = {
	MACHINE: "machine",
	CONTROLS: "controls",
} as const;

export const HOME_ENTRY_ACTION_CLASS_NAMES = {
	ROOT: "relative min-h-17 w-full space-y-2 sm:w-auto",
	BUTTON: "min-h-11 w-full px-5 sm:w-auto",
	STATUS:
		"absolute bottom-0 left-0 h-4 font-mono text-xs whitespace-nowrap text-muted-foreground",
	STATUS_SKELETON:
		"absolute bottom-0 left-0 h-4 w-32 motion-reduce:animate-none",
} as const;

export type HomeFieldGuideValue =
	(typeof HOME_FIELD_GUIDE_VALUES)[keyof typeof HOME_FIELD_GUIDE_VALUES];

export const HOME_RUNTIME_ROOMS = [
	{
		id: "entrance",
		machineState: "entrance",
		room: "Entrance",
		status: "active",
	},
	{
		id: "library",
		machineState: "library",
		room: "Library",
		status: "available",
	},
	{
		id: "guard-room",
		machineState: "guardRoom",
		room: "Guard Room",
		status: "available",
	},
	{
		id: "treasury",
		machineState: "treasury",
		room: "Treasury",
		status: "guarded",
	},
	{
		id: "exit",
		machineState: "exit",
		room: "Exit",
		status: "pending",
	},
] as const;

export const HOME_SYSTEM_VIEWS = [
	{
		label: "Viewport",
		description: "Move through the machine as a physical dungeon.",
	},
	{
		label: "Live statechart",
		description: "See the active state and available transitions change.",
	},
	{
		label: "Run context",
		description: "Inspect HP, inventory, guards, and the current room.",
	},
] as const;

export const HOME_RUN_STEPS = [
	{
		index: "01",
		title: "Enter the machine",
		description:
			"Walk from Entrance into the Library. Each chamber is one explicit state.",
	},
	{
		index: "02",
		title: "Change the context",
		description:
			"Defeat the guardian and collect the Treasure Key in the Guard Room.",
	},
	{
		index: "03",
		title: "Satisfy the guard",
		description:
			"Use both conditions to unlock the Treasury, then continue to Exit.",
	},
] as const;

export const HOME_CONCEPT_MAPPINGS = [
	{
		construct: "State",
		manifestation: "Room",
		description: "The one place the machine currently occupies.",
	},
	{
		construct: "Transition",
		manifestation: "Corridor",
		description: "An explicit route from one state to another.",
	},
	{
		construct: "Event",
		manifestation: "Player action",
		description: "Input that asks the machine to change state.",
	},
	{
		construct: "Guard",
		manifestation: "Locked door",
		description: "A condition that must pass before traversal.",
	},
	{
		construct: "Context",
		manifestation: "Key, HP, room",
		description: "Data that changes which paths are valid.",
	},
	{
		construct: "Actor",
		manifestation: "Independent loop",
		description: "A player, guardian, camera, or audio machine.",
	},
] as const;

export const HOME_CONTROL_GROUPS = [
	{
		label: "Move",
		keys: "WASD / arrows",
	},
	{
		label: "Run",
		keys: "Shift",
	},
	{
		label: "Jump",
		keys: "Space",
	},
	{
		label: "Interact",
		keys: "E",
	},
	{
		label: "Attack",
		keys: "F",
	},
] as const;

export const HOME_TOUCH_CONTROL_GROUPS = [
	{
		label: "Move",
		control: "Left joystick",
	},
	{
		label: "Look",
		control: "Drag the viewport",
	},
	{
		label: "Run",
		control: "Run toggle",
	},
	{
		label: "Jump",
		control: "Jump button",
	},
	{
		label: "Interact / attack",
		control: "Context buttons",
	},
	{
		label: "Statechart / HUD",
		control: "Panels button",
	},
] as const;

export const HOME_CAMERA_MODES = [
	"1 Third person",
	"2 Top down",
	"3 First person",
	"4 Free orbit",
] as const;

export const HOME_TOUCH_CAMERA_MODES = [
	{
		abbreviation: "3P",
		label: "Third person",
	},
	{
		abbreviation: "TD",
		label: "Top down",
	},
	{
		abbreviation: "1P",
		label: "First person",
	},
	{
		abbreviation: "FO",
		label: "Free orbit",
	},
] as const;
