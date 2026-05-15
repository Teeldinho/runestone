import { CAMERA_CONTROLS_MODE_POLICY, type CameraModeId } from "../config";

export const resolveCameraControlsModePolicy = (mode: CameraModeId) =>
	CAMERA_CONTROLS_MODE_POLICY[mode];
