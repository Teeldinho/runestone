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

export const TUTORIAL_FIRST_RUN_COPY = {
	SECTION_HEADING: "First run path",
} as const;
