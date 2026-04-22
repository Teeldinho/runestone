import { OrbitControls, PointerLockControls } from "@react-three/drei";
import type React from "react";

import {
	CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE,
	CAMERA_RIG_TOUCH_GESTURES,
} from "../config";
import type { CameraRigFirstPersonBindings, CameraRigRefs } from "../model";

type CameraRigFirstPersonControlsProps = {
	firstPersonBindings: CameraRigFirstPersonBindings;
	refs: CameraRigRefs;
	isDesktopLayout: boolean;
};

export function CameraRigFirstPersonControls({
	firstPersonBindings,
	refs,
	isDesktopLayout,
}: CameraRigFirstPersonControlsProps) {
	if (!isDesktopLayout) {
		if (!firstPersonBindings.firstPersonLookElement) {
			return null;
		}

		return (
			<OrbitControls
				ref={refs.firstPersonOrbitRef as React.RefObject<never>}
				makeDefault
				enablePan={false}
				enableZoom={false}
				enableRotate
				minDistance={CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE}
				maxDistance={CAMERA_RIG_FIRST_PERSON_FIXED_ORBIT_DISTANCE}
				touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
				onStart={firstPersonBindings.handleOrbitStart}
				onEnd={firstPersonBindings.handleOrbitEnd}
				domElement={firstPersonBindings.firstPersonLookElement}
			/>
		);
	}

	return (
		<PointerLockControls
			ref={refs.pointerLockRef as React.RefObject<never>}
			selector="#game-canvas-fp-lock"
			onLock={firstPersonBindings.handleFirstPersonLock}
			onUnlock={firstPersonBindings.handleFirstPersonUnlock}
		/>
	);
}

export type { CameraRigFirstPersonControlsProps };
