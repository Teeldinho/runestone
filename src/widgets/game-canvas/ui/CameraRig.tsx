import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import { useCameraRigViewModel } from "../model/useCameraRigViewModel";

import { CameraRigFirstPersonControls } from "./CameraRigFirstPersonControls";
import { CameraRigFreeOrbitalControls } from "./CameraRigFreeOrbitalControls";
import { CameraRigThirdPersonControls } from "./CameraRigThirdPersonControls";
import { CameraRigTopDownControls } from "./CameraRigTopDownControls";

type CameraRigProps = {
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot?: CameraStateSnapshot;
	firstPersonLookElement?: HTMLElement | null;
	playerSpawnPosition: Vector3Tuple;
};

export function CameraRig({
	cameraControlElement,
	cameraStateSnapshot,
	firstPersonLookElement,
	playerSpawnPosition,
}: CameraRigProps) {
	const {
		controlKey,
		freeOrbitalOrbitRef,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
		mode,
		pointerLockRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
		firstPersonOrbitRef,
		isDesktopLayout,
	} = useCameraRigViewModel({
		cameraControlElement,
		cameraStateSnapshot,
		playerSpawnPosition,
	});

	if (mode === CAMERA_MODES.FREE_ORBITAL) {
		return (
			<CameraRigFreeOrbitalControls
				cameraControlElement={cameraControlElement}
				controlKey={controlKey}
				freeOrbitalOrbitRef={freeOrbitalOrbitRef}
				handleOrbitEnd={handleOrbitEnd}
				handleOrbitStart={handleOrbitStart}
				isDesktopLayout={isDesktopLayout}
			/>
		);
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		return (
			<CameraRigThirdPersonControls
				cameraControlElement={cameraControlElement}
				controlKey={controlKey}
				handleOrbitEnd={handleOrbitEnd}
				handleOrbitStart={handleOrbitStart}
				isDesktopLayout={isDesktopLayout}
				thirdPersonOrbitRef={thirdPersonOrbitRef}
			/>
		);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return (
			<CameraRigFirstPersonControls
				controlKey={controlKey}
				firstPersonLookElement={firstPersonLookElement}
				firstPersonOrbitRef={firstPersonOrbitRef}
				handleFirstPersonLock={handleFirstPersonLock}
				handleFirstPersonUnlock={handleFirstPersonUnlock}
				handleOrbitEnd={handleOrbitEnd}
				handleOrbitStart={handleOrbitStart}
				isDesktopLayout={isDesktopLayout}
				pointerLockRef={pointerLockRef}
			/>
		);
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		return (
			<CameraRigTopDownControls
				cameraControlElement={cameraControlElement}
				controlKey={controlKey}
				handleOrbitEnd={handleOrbitEnd}
				handleOrbitStart={handleOrbitStart}
				isDesktopLayout={isDesktopLayout}
				topDownOrbitRef={topDownOrbitRef}
			/>
		);
	}

	return null;
}
