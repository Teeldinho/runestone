export const TUTORIAL_COPY = {
	BADGE: "Quick guide",
	HEADING: "How to Play",
	SUBTITLE: "Learn the basics, then step into the dungeon when you’re ready.",
	CONTROLS_HEADING: "Controls",
	CONTROLS_DESCRIPTION:
		"The essentials: move, interact, attack, and change the camera.",
	OBJECTIVES_HEADING: "Your first run",
	OBJECTIVES_DESCRIPTION:
		"Explore the entrance, find the key, and reach the exit.",
	TIPS_HEADING: "Tips",
	TIPS_DESCRIPTION: "A few small reminders that keep the dungeon easy to read.",
	CTA_LABEL: "Enter Dungeon",
	HOME_LABEL: "Back to Home",
} as const;

export const TUTORIAL_CONTROLS = [
	{
		detail: "Use WASD or the arrow keys to walk through corridors and rooms.",
		keyLabel: "WASD / ARROWS",
		label: "Move through the dungeon",
	},
	{
		detail: "Press F to open doors and use nearby objects.",
		keyLabel: "F",
		label: "Interact with prompts",
	},
	{
		detail: "Press E when enemies are in range.",
		keyLabel: "E",
		label: "Attack nearby foes",
	},
	{
		detail: "Use 1-4 to switch between the camera views.",
		keyLabel: "1-4",
		label: "Switch camera modes",
	},
] as const;

export const TUTORIAL_OBJECTIVES = [
	{
		step: 1,
		label: "Explore the entrance",
		detail: "Walk through the first rooms and get your bearings.",
	},
	{
		step: 2,
		label: "Find the key",
		detail: "Pick up the Treasure Key when you spot it.",
	},
	{
		step: 3,
		label: "Open the path forward",
		detail: "Use the key to unlock the next door.",
	},
	{
		step: 4,
		label: "Clear the guard room",
		detail: "Defeat the enemies and finish the floor.",
	},
] as const;

export const TUTORIAL_TIPS = [
	"Try the different camera views to find the one that feels easiest.",
	"Watch your HP in the HUD; enemies deal damage on contact.",
	"Achievements unlock automatically as you complete objectives.",
	"The dungeon resets when you restart, giving you a fresh run.",
] as const;
