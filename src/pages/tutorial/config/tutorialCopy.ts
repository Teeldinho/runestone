import { ACHIEVEMENT_COPY } from "@/features/achievements";

export const TUTORIAL_COPY = {
	HEADING: "How to Play",
	SUBTITLE: "Controls and objectives for your dungeon run",
	CONTROLS_HEADING: "Controls",
	OBJECTIVES_HEADING: "Objectives",
	TIPS_HEADING: "Tips",
	CTA_LABEL: "Enter Dungeon",
} as const;

export const TUTORIAL_CONTROLS = [
	{ key: "W", label: "Move Forward" },
	{ key: "S", label: "Move Backward" },
	{ key: "A", label: "Strafe Left" },
	{ key: "D", label: "Strafe Right" },
] as const;

export const TUTORIAL_OBJECTIVES = [
	{
		step: 1,
		label: "Explore the Dungeon",
		detail: "Walk through corridors to discover new rooms.",
	},
	{
		step: 2,
		label: ACHIEVEMENT_COPY.FIRST_STEPS.label,
		detail: "Find and enter the Library.",
	},
	{
		step: 3,
		label: ACHIEVEMENT_COPY.KEY_HUNTER.label,
		detail: "Locate and collect the Treasure Key.",
	},
	{
		step: 4,
		label: ACHIEVEMENT_COPY.COMBAT_MASTER.label,
		detail: "Defeat all enemies in the Guard Room.",
	},
] as const;

export const TUTORIAL_TIPS = [
	"Use the camera switcher panel to change your view angle.",
	"Watch your HP in the HUD — enemies deal damage on contact.",
	"Achievements unlock automatically as you complete objectives.",
	"The dungeon resets when you restart, giving you a fresh run.",
] as const;
