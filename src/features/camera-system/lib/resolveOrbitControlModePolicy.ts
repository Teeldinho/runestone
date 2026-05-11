import { type CameraModeId, ORBIT_CONTROL_MODE_POLICY } from "../config";

export const resolveOrbitControlModePolicy = (mode: CameraModeId) =>
	ORBIT_CONTROL_MODE_POLICY[mode];
