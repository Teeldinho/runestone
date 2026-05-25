export const CONCEPTS_COPY = {
	CTA_LABEL: "Enter Dungeon",
	HEADING: "System concepts.",
	SECONDARY_LINK_LABEL: "Read the Guide",
	SUBTITLE:
		"Runestone maps statechart ideas to dungeon objects so software behavior can be explored spatially.",
	CTA_HEADING: "Ready to inspect the dungeon?",
} as const;

export const CONCEPTS_SECTIONS = [
	{
		detail:
			"A state describes where the system currently is. In Runestone, that state is represented by the room the player occupies.",
		label: "State → Room",
	},
	{
		detail:
			"A transition describes how the system moves from one state to another. In the dungeon, transitions appear as corridors and doorways.",
		label: "Transition → Corridor",
	},
	{
		detail:
			"Events are messages sent to the system. Movement, interaction, attack, run, and jump actions all dispatch events.",
		label: "Event → Input or prompt",
	},
	{
		detail:
			"A guard decides whether a transition is allowed. Locked doors, keys, enemies, and room conditions make those rules visible.",
		label: "Guard → Locked door",
	},
	{
		detail:
			"Context is the data carried by the run. Keys, HP, current room, and discovered rooms can change what paths are available.",
		label: "Context → Inventory and HP",
	},
	{
		detail:
			"Actors isolate behavior. Camera, player, input, audio, and dungeon logic can each respond to events without becoming one tangled system.",
		label: "Actor → Independent loop",
	},
] as const;
