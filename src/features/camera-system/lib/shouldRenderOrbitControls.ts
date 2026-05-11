import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

export const shouldRenderOrbitControls = (mode: CameraModeId): boolean =>
	mode !== CAMERA_MODE_IDS.FIRST_PERSON;
