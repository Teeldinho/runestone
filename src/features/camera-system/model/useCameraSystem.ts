import { useCallback, useEffect, useMemo, useState } from "react";
import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEY_EVENT_TYPE,
	isCameraHotkey,
} from "@/features/camera-system/config";

import { createCameraStateSnapshot, getCameraModeFromEvent } from "../lib";
import type { CameraMachineEvent } from "./types";

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
