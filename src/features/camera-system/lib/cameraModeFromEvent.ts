import {
	CAMERA_EVENTS,
	CAMERA_MODES,
	CAMERA_MODES_BY_HOTKEY,
	type CameraMode,
} from "@/features/camera-system/config";
import type { CameraMachineEvent } from "@/features/camera-system/model/types";

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
