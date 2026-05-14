import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import { useCameraRigViewModel } from "../model";

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
	const { firstPersonBindings, orbitBindings, refs, mode, isDesktopLayout } =
		useCameraRigViewModel({
			cameraControlElement,
			cameraStateSnapshot,
			firstPersonLookElement,
			playerSpawnPosition,
		});

	if (mode === CAMERA_MODES.FREE_ORBITAL) {
		return (
			<CameraRigFreeOrbitalControls
				key={mode}
				orbitBindings={orbitBindings.freeOrbital}
				refs={refs}
			/>
		);
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		return (
			<CameraRigThirdPersonControls
				key={mode}
				orbitBindings={orbitBindings.thirdPerson}
				refs={refs}
			/>
		);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return (
			<CameraRigFirstPersonControls
				key={mode}
				firstPersonBindings={firstPersonBindings}
				refs={refs}
				isDesktopLayout={isDesktopLayout}
			/>
		);
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		return (
			<CameraRigTopDownControls
				key={mode}
				orbitBindings={orbitBindings.topDown}
				refs={refs}
			/>
		);
	}

	return null;
}
