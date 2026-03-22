import { useMemo } from "react";

import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";

import { CAMERA_MODE_SWITCHER_OPTIONS } from "../config";

type CameraModeButton = {
	handleCameraModeSwitch: () => void;
	hotkey: string;
	isActive: boolean;
	label: string;
	mode: CameraMode;
};

type CameraModeSwitcherViewModel = {
	cameraModeButtons: CameraModeButton[];
};

type UseCameraModeSwitcherParams = {
	activeCameraMode: CameraMode;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
};

export const useCameraModeSwitcher = ({
	activeCameraMode,
	handleCameraModeSwitch,
}: UseCameraModeSwitcherParams): CameraModeSwitcherViewModel => {
	return useMemo(
		() => ({
			cameraModeButtons: CAMERA_MODE_SWITCHER_OPTIONS.map((cameraOption) => ({
				handleCameraModeSwitch: () => {
					handleCameraModeSwitch({
						type: cameraOption.eventType,
					});
				},
				hotkey: cameraOption.hotkey,
				isActive: cameraOption.mode === activeCameraMode,
				label: cameraOption.label,
				mode: cameraOption.mode,
			})),
		}),
		[activeCameraMode, handleCameraModeSwitch],
	);
};

export type { CameraModeButton, CameraModeSwitcherViewModel };
