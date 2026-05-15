import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

type ResolveMovementAzimuthFromCameraControlsInput = {
	readonly mode: CameraModeId;
	readonly azimuthAngle: number;
};

export const resolveMovementAzimuthFromCameraControls = ({
	mode,
	azimuthAngle,
}: ResolveMovementAzimuthFromCameraControlsInput): number =>
	mode === CAMERA_MODE_IDS.TOP_DOWN ? 0 : azimuthAngle + Math.PI;

export type { ResolveMovementAzimuthFromCameraControlsInput };
