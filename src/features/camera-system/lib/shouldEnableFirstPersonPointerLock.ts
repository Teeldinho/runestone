import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

type ShouldEnableFirstPersonPointerLockInput = {
	readonly isDesktopLayout: boolean;
	readonly mode: CameraModeId;
};

export const shouldEnableFirstPersonPointerLock = ({
	isDesktopLayout,
	mode,
}: ShouldEnableFirstPersonPointerLockInput): boolean =>
	isDesktopLayout && mode === CAMERA_MODE_IDS.FIRST_PERSON;

export type { ShouldEnableFirstPersonPointerLockInput };
