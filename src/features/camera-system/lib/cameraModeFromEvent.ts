import {
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
	type CameraHotkey,
	type CameraMode,
} from "@/features/camera-system/config";
import type { CameraMachineEvent } from "@/features/camera-system/model/types";

const CAMERA_MODES_BY_HOTKEY: Record<CameraHotkey, CameraMode> = {
	[CAMERA_HOTKEYS.THIRD_PERSON]: CAMERA_MODES.THIRD_PERSON,
	[CAMERA_HOTKEYS.TOP_DOWN]: CAMERA_MODES.TOP_DOWN,
	[CAMERA_HOTKEYS.FIRST_PERSON]: CAMERA_MODES.FIRST_PERSON,
	[CAMERA_HOTKEYS.FREE_ORBITAL]: CAMERA_MODES.FREE_ORBITAL,
};

export const getCameraModeFromEvent = (
	event: CameraMachineEvent,
): CameraMode => {
	if (event.type === CAMERA_EVENTS.HOTKEY) {
		return CAMERA_MODES_BY_HOTKEY[event.hotkey];
	}

	if (event.type === CAMERA_EVENTS.SWITCH_TO_THIRD_PERSON) {
		return CAMERA_MODES.THIRD_PERSON;
	}

	if (event.type === CAMERA_EVENTS.SWITCH_TO_TOP_DOWN) {
		return CAMERA_MODES.TOP_DOWN;
	}

	if (event.type === CAMERA_EVENTS.SWITCH_TO_FIRST_PERSON) {
		return CAMERA_MODES.FIRST_PERSON;
	}

	return CAMERA_MODES.FREE_ORBITAL;
};
