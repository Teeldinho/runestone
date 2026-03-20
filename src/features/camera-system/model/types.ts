import type { CameraEventObject, CameraHotkey, CameraMode } from "@/features/camera-system/config";
import type { Vector3Tuple } from "@/shared/types";

export type CameraStateSnapshot = {
	mode: CameraMode;
	position: Vector3Tuple;
	target: Vector3Tuple;
	zoom: number;
};

export type CameraMachineEvent = CameraEventObject;

export type CameraHotkeyBinding = {
	hotkey: CameraHotkey;
	mode: CameraMode;
};
