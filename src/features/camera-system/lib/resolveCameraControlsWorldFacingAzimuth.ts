import {
	CAMERA_CONTROLS_CONSTANTS,
	CAMERA_MODE_IDS,
	type CameraModeId,
} from "../config";

type ResolveCameraControlsWorldFacingAzimuthInput = {
	readonly mode: CameraModeId;
	readonly cameraAzimuthAngle: number;
	readonly previousWorldFacingAzimuth: number | null;
};

export const resolveCameraControlsWorldFacingAzimuth = ({
	mode,
	cameraAzimuthAngle,
	previousWorldFacingAzimuth,
}: ResolveCameraControlsWorldFacingAzimuthInput): number => {
	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return (
			previousWorldFacingAzimuth ??
			CAMERA_CONTROLS_CONSTANTS.DEFAULT_WORLD_FACING_AZIMUTH
		);
	}

	return (
		cameraAzimuthAngle + CAMERA_CONTROLS_CONSTANTS.WORLD_FACING_AZIMUTH_OFFSET
	);
};

export type { ResolveCameraControlsWorldFacingAzimuthInput };
