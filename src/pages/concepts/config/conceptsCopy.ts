import { CONCEPTS_SECTION_ICON_KEYS } from "./conceptsIconConfig";

export const CONCEPTS_COPY = {
	CTA_LABEL: "Enter Dungeon",
	HEADING: "System concepts.",
	MAPPING_HEADING: "Concept map",
	SECONDARY_LINK_LABEL: "Read the Guide",
	HERO_SUBTITLE:
		"Runestone maps statechart ideas to dungeon objects so software behavior can be explored spatially.",
	CTA_HEADING: "Ready to inspect the dungeon?",
	CTA_SUBTITLE: "Use the guide as a map, then inspect the concepts in motion.",
} as const;

export const CONCEPTS_SECTION_IDS = {
	ACTOR: "actor-independent-loop",
	CONTEXT: "context-inventory-hp-current-room",
	EVENT: "event-input-prompt",
	GUARD: "guard-locked-door",
	STATE: "state-room",
	TRANSITION: "transition-corridor",
} as const;

export const CONCEPTS_MAPPING_TONES = {
	ACTIVE: "active",
	AVAILABLE: "available",
	SEALED: "sealed",
} as const;

export type ConceptsMappingTone =
	(typeof CONCEPTS_MAPPING_TONES)[keyof typeof CONCEPTS_MAPPING_TONES];

export const CONCEPTS_MAPPING_TONE_CLASS_NAMES = {
	[CONCEPTS_MAPPING_TONES.ACTIVE]:
		"border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
	[CONCEPTS_MAPPING_TONES.AVAILABLE]:
		"border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
	[CONCEPTS_MAPPING_TONES.SEALED]:
		"border-dungeon-rune-sealed/50 bg-dungeon-rune-sealed/10 text-dungeon-rune-sealed",
} as const;

export const CONCEPTS_TITLE_TONE_CLASS_NAMES = {
	[CONCEPTS_MAPPING_TONES.ACTIVE]: "text-panel-title",
	[CONCEPTS_MAPPING_TONES.AVAILABLE]: "text-panel-title",
	[CONCEPTS_MAPPING_TONES.SEALED]: "text-dungeon-rune-sealed",
} as const;

export const CONCEPTS_SECTIONS = [
	{
		detail:
			"A state marks the current room or mode, holding the system in one place until conditions change.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.STATE,
		id: CONCEPTS_SECTION_IDS.STATE,
		source: "State",
		target: "Room",
		tone: CONCEPTS_MAPPING_TONES.ACTIVE,
	},
	{
		detail:
			"A transition carries the run from one room to the next when an event resolves successfully.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.TRANSITION,
		id: CONCEPTS_SECTION_IDS.TRANSITION,
		source: "Transition",
		target: "Corridor",
		tone: CONCEPTS_MAPPING_TONES.AVAILABLE,
	},
	{
		detail:
			"Inputs and prompts trigger evaluation, which can open movement paths or advance other systems.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.EVENT,
		id: CONCEPTS_SECTION_IDS.EVENT,
		source: "Event",
		target: "Input or prompt",
		tone: CONCEPTS_MAPPING_TONES.AVAILABLE,
	},
	{
		detail:
			"A guard blocks traversal until the required state, key, or condition is satisfied.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.GUARD,
		id: CONCEPTS_SECTION_IDS.GUARD,
		source: "Guard",
		target: "Locked door",
		tone: CONCEPTS_MAPPING_TONES.SEALED,
	},
	{
		detail:
			"Context keeps the values a run depends on, such as inventory, HP, and current room state.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.CONTEXT,
		id: CONCEPTS_SECTION_IDS.CONTEXT,
		source: "Context",
		target: "Inventory, HP, current room",
		tone: CONCEPTS_MAPPING_TONES.AVAILABLE,
	},
	{
		detail:
			"Actors run in isolated loops so camera, player, or audio behavior can respond independently.",
		iconKey: CONCEPTS_SECTION_ICON_KEYS.ACTOR,
		id: CONCEPTS_SECTION_IDS.ACTOR,
		source: "Actor",
		target: "Independent loop",
		tone: CONCEPTS_MAPPING_TONES.ACTIVE,
	},
] as const;
