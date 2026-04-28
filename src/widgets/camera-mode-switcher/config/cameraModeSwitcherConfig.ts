import {
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
} from "@/features/camera-system";

type CameraModeSwitchEventType =
	| typeof CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON
	| typeof CAMERA_EVENTS.SWITCH_TO_TOP_DOWN
	| typeof CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON
	| typeof CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL;

export const CAMERA_MODE_SWITCHER_COPY = {
	DESKTOP_LABEL: "Camera Mode",
	TITLE: "Camera Modes",
	DESCRIPTION: "Switch the active camera perspective for the dungeon scene.",
	HOTKEY_PREFIX: "Key",
} as const;

export const CAMERA_MODE_SWITCHER_OPTIONS = [
	{
		mode: CAMERA_MODES.THIRD_PERSON,
		label: "Third Person",
		hotkey: CAMERA_HOTKEYS.THIRD_PERSON,
		eventType: CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON,
	},
	{
		mode: CAMERA_MODES.TOP_DOWN,
		label: "Top Down",
		hotkey: CAMERA_HOTKEYS.TOP_DOWN,
		eventType: CAMERA_EVENTS.SWITCH_TO_TOP_DOWN,
	},
	{
		mode: CAMERA_MODES.FIRST_PERSON,
		label: "First Person",
		hotkey: CAMERA_HOTKEYS.FIRST_PERSON,
		eventType: CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON,
	},
	{
		mode: CAMERA_MODES.FREE_ORBITAL,
		label: "Free Orbital",
		hotkey: CAMERA_HOTKEYS.FREE_ORBITAL,
		eventType: CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL,
	},
] as const satisfies readonly {
	mode: (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES];
	label: string;
	hotkey: (typeof CAMERA_HOTKEYS)[keyof typeof CAMERA_HOTKEYS];
	eventType: CameraModeSwitchEventType;
}[];

export const CAMERA_MODE_ICON_LABELS: Record<
	(typeof CAMERA_MODES)[keyof typeof CAMERA_MODES],
	string
> = {
	[CAMERA_MODES.THIRD_PERSON]: "3P",
	[CAMERA_MODES.TOP_DOWN]: "TD",
	[CAMERA_MODES.FIRST_PERSON]: "1P",
	[CAMERA_MODES.FREE_ORBITAL]: "FO",
};
