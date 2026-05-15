import {
	CAMERA_CONTROLS_CONSTANTS,
	CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
	CAMERA_MODE_IDS,
	type CameraModeId,
} from "../config";
import { clampCameraControlsPolarAngle } from "./clampCameraControlsPolarAngle";

type ResolveCameraControlsTransitionAnglesInput = {
	readonly destinationMode: CameraModeId;
	readonly preservedWorldFacingAzimuth: number | null;
	readonly preservedPolarAngle: number | null;
	readonly destinationMinPolarAngle: number;
	readonly destinationMaxPolarAngle: number;
};

export type CameraControlsTransitionAngles = {
	readonly azimuthAngle: number;
	readonly polarAngle: number;
};

export const resolveCameraControlsTransitionAngles = ({
	destinationMode,
	preservedWorldFacingAzimuth,
	preservedPolarAngle,
	destinationMinPolarAngle,
	destinationMaxPolarAngle,
}: ResolveCameraControlsTransitionAnglesInput): CameraControlsTransitionAngles => {
	const fallbackPolarAngle =
		(destinationMinPolarAngle + destinationMaxPolarAngle) / 2;

	const nextPolarAngle = clampCameraControlsPolarAngle({
		polarAngle: preservedPolarAngle ?? fallbackPolarAngle,
		minPolarAngle: destinationMinPolarAngle,
		maxPolarAngle: destinationMaxPolarAngle,
	});

	if (destinationMode === CAMERA_MODE_IDS.TOP_DOWN) {
		return {
			azimuthAngle: CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
			polarAngle: nextPolarAngle,
		};
	}

	const nextWorldFacingAzimuth =
		preservedWorldFacingAzimuth ??
		CAMERA_CONTROLS_CONSTANTS.DEFAULT_WORLD_FACING_AZIMUTH;

	return {
		azimuthAngle:
			nextWorldFacingAzimuth -
			CAMERA_CONTROLS_CONSTANTS.WORLD_FACING_AZIMUTH_OFFSET,
		polarAngle: nextPolarAngle,
	};
};

export type { ResolveCameraControlsTransitionAnglesInput };
