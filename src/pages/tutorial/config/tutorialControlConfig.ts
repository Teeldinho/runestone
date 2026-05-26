import { TUTORIAL_ICON_KEYS } from "./tutorialIconConfig";

export const TUTORIAL_CONTROL_TONES = {
	ACCENT: "accent",
	PRIMARY: "primary",
} as const;

export type TutorialControlTone =
	(typeof TUTORIAL_CONTROL_TONES)[keyof typeof TUTORIAL_CONTROL_TONES];

export const TUTORIAL_CONTROL_GROUPS = [
	{
		heading: "Movement",
		rows: [
			{
				label: "Move",
				mobileIconKey: TUTORIAL_ICON_KEYS.GAMEPAD,
				mobileLabel: "Left joystick",
				shortcuts: ["W", "A", "S", "D"],
			},
			{
				label: "Run toggle",
				mobileIconKey: TUTORIAL_ICON_KEYS.FOOTPRINTS,
				mobileLabel: "Footprints button",
				shortcuts: ["Shift"],
			},
			{
				label: "Jump",
				mobileIconKey: TUTORIAL_ICON_KEYS.CHEVRONS_UP,
				mobileLabel: "Chevrons-up button",
				shortcuts: ["Space"],
			},
		],
		tone: TUTORIAL_CONTROL_TONES.PRIMARY,
	},
	{
		heading: "Actions",
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
		tone: TUTORIAL_CONTROL_TONES.ACCENT,
	},
] as const;

export const TUTORIAL_CAMERA_MODES = [
	{
		code: "3P",
		key: "1",
		label: "3rd Person",
	},
	{
		code: "TD",
		key: "2",
		label: "Top Down",
	},
	{
		code: "1P",
		key: "3",
		label: "1st Person",
	},
	{
		code: "FO",
		key: "4",
		label: "Free Orbital",
	},
] as const;
