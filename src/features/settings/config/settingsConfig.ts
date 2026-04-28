import { STORAGE_KEYS } from "@/shared/config";

export const SETTINGS_DEFAULTS = {
	masterVolume: 0.8,
	musicVolume: 0.55,
	hapticsEnabled: true,
	postprocessingEnabled: false,
} as const;

export const SETTINGS_VOLUME_RANGE = {
	MIN: 0,
	MAX: 1,
	STEP: 0.05,
} as const;

export const SETTINGS_STORAGE_KEYS = {
	SETTINGS: STORAGE_KEYS.SETTINGS,
} as const;

export const SETTINGS_COPY = {
	PAGE_TITLE: "Settings",
	PAGE_DESCRIPTION: "Adjust audio levels and haptic feedback.",
	AUDIO_SECTION: "Audio",
	HAPTICS_SECTION: "Haptics",
	MASTER_VOLUME_LABEL: "Master Volume",
	MUSIC_VOLUME_LABEL: "Music Volume",
	HAPTICS_TOGGLE_LABEL: "Haptic Feedback",
	HAPTICS_ON_LABEL: "On",
	HAPTICS_OFF_LABEL: "Off",
	RESET_BUTTON: "Reset to Defaults",
	GRAPHICS_SECTION: "Graphics",
	POSTPROCESSING_TOGGLE_LABEL: "Postprocessing",
	POSTPROCESSING_ON_LABEL: "On",
	POSTPROCESSING_OFF_LABEL: "Off",
} as const;
