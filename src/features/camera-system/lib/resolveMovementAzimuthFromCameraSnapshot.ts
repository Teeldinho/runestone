import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

type ResolveMovementAzimuthFromCameraSnapshotInput = {
	readonly mode: CameraModeId;
	readonly yaw: number;
};

export const resolveMovementAzimuthFromCameraSnapshot = ({
	mode,
	yaw,
}: ResolveMovementAzimuthFromCameraSnapshotInput): number =>
	mode === CAMERA_MODE_IDS.TOP_DOWN ? 0 : yaw;

export type { ResolveMovementAzimuthFromCameraSnapshotInput };
