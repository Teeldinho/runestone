import { useCallback, useEffect, useMemo, useState } from "react";
import type { CameraHotkey } from "@/features/camera-system/config";
import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
} from "@/features/camera-system/config";

import { createCameraStateSnapshot, getCameraModeFromEvent } from "../lib";
import type { CameraMachineEvent } from "./types";

const CAMERA_HOTKEY_SET: ReadonlySet<string> = new Set([
	CAMERA_HOTKEYS.THIRD_PERSON,
	CAMERA_HOTKEYS.TOP_DOWN,
	CAMERA_HOTKEYS.FIRST_PERSON,
	CAMERA_HOTKEYS.FREE_ORBITAL,
]);

const isCameraHotkey = (hotkey: string): hotkey is CameraHotkey =>
	CAMERA_HOTKEY_SET.has(hotkey);

const CAMERA_HOTKEY_EVENT_TYPE = "keydown";

export const useCameraSystem = () => {
	const [cameraStateSnapshot, setCameraStateSnapshot] = useState(() =>
		createCameraStateSnapshot(CAMERA_DEFAULT_MODE),
	);

	const handleCameraModeSwitch = useCallback((event: CameraMachineEvent) => {
		setCameraStateSnapshot(
			createCameraStateSnapshot(getCameraModeFromEvent(event)),
		);
	}, []);

	const handleCameraHotkeyPress = useCallback(
		(event: KeyboardEvent) => {
			if (!isCameraHotkey(event.key)) {
				return;
			}

			handleCameraModeSwitch({
				type: CAMERA_EVENTS.HOTKEY,
				hotkey: event.key,
			});
		},
		[handleCameraModeSwitch],
	);

	useEffect(() => {
		window.addEventListener(CAMERA_HOTKEY_EVENT_TYPE, handleCameraHotkeyPress);

		return () => {
			window.removeEventListener(
				CAMERA_HOTKEY_EVENT_TYPE,
				handleCameraHotkeyPress,
			);
		};
	}, [handleCameraHotkeyPress]);

	return useMemo(
		() => ({
			cameraStateSnapshot,
			handleCameraModeSwitch,
		}),
		[cameraStateSnapshot, handleCameraModeSwitch],
	);
};
