import type { RefObject } from "react";
import { useEffect } from "react";

import {
	CAMERA_MODES,
	type CameraStateSnapshot,
} from "@/features/camera-system";
import { setCameraMode } from "@/shared/lib";

type UseCameraRigModeSyncInput = {
	mode: CameraStateSnapshot["mode"] | undefined;
	needsFirstPersonSyncRef: RefObject<boolean>;
	needsFreeOrbitalSyncRef: RefObject<boolean>;
	needsThirdPersonSyncRef: RefObject<boolean>;
	needsTopDownSyncRef: RefObject<boolean>;
};

export const useCameraRigModeSync = ({
	mode,
	needsFirstPersonSyncRef,
	needsFreeOrbitalSyncRef,
	needsThirdPersonSyncRef,
	needsTopDownSyncRef,
}: UseCameraRigModeSyncInput): void => {
	useEffect(() => {
		if (!mode) {
			return;
		}

		setCameraMode(mode);
	}, [mode]);

	useEffect(() => {
		if (!mode) {
			return;
		}

		needsThirdPersonSyncRef.current = mode === CAMERA_MODES.THIRD_PERSON;
		needsFreeOrbitalSyncRef.current = mode === CAMERA_MODES.FREE_ORBITAL;
		needsTopDownSyncRef.current = mode === CAMERA_MODES.TOP_DOWN;
		needsFirstPersonSyncRef.current = mode === CAMERA_MODES.FIRST_PERSON;
	}, [
		mode,
		needsFirstPersonSyncRef,
		needsFreeOrbitalSyncRef,
		needsThirdPersonSyncRef,
		needsTopDownSyncRef,
	]);
};

export type { UseCameraRigModeSyncInput };
