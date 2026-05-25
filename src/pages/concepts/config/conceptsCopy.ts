export const CONCEPTS_COPY = {
	CTA_LABEL: "Enter Dungeon",
	HEADING: "System concepts.",
	MAPPING_HEADING: "Concept map",
	SECONDARY_LINK_LABEL: "Read the Guide",
	HERO_SUBTITLE:
		"Runestone maps statechart ideas to dungeon objects so software behavior can be explored spatially.",
	CTA_HEADING: "Ready to inspect the dungeon?",
	CTA_SUBTITLE: "Drop your configuration into the engine.",
} as const;

export const CONCEPTS_MAPPING_TONE_CLASS_NAMES = {
	active: "border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
	available: "border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
	sealed:
		"border-dungeon-rune-sealed/50 bg-dungeon-rune-sealed/10 text-dungeon-rune-sealed",
} as const;

export const CONCEPTS_SECTIONS = [
	{
		detail:
			"A state marks the current room or mode, holding the system in one place until conditions change.",
		source: "State",
		target: "Room",
		tone: "active",
	},
	{
		detail:
			"A transition carries the run from one room to the next when an event resolves successfully.",
		source: "Transition",
		target: "Corridor",
		tone: "available",
	},
	{
		detail:
			"Inputs and prompts trigger evaluation, which can open movement paths or advance other systems.",
		source: "Event",
		target: "Input or prompt",
		tone: "available",
	},
	{
		detail:
			"A guard blocks traversal until the required state, key, or condition is satisfied.",
		source: "Guard",
		target: "Locked door",
		tone: "sealed",
	},
	{
		detail:
			"Context keeps the values a run depends on, such as inventory, HP, and current room state.",
		source: "Context",
		target: "Inventory, HP, current room",
		tone: "available",
	},
	{
		detail:
			"Actors run in isolated loops so camera, player, or audio behavior can respond independently.",
		source: "Actor",
		target: "Independent loop",
		tone: "active",
	},
] as const;
