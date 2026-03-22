import {
	CAMERA_HOTKEY_VALUES,
	type CameraHotkey,
} from "@/features/camera-system/config";

export const isCameraHotkey = (hotkey: string): hotkey is CameraHotkey =>
	CAMERA_HOTKEY_VALUES.some((cameraHotkey) => cameraHotkey === hotkey);
