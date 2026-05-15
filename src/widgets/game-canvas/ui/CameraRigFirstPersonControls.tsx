import { PointerLockControls } from "@react-three/drei";
import type React from "react";

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
		return null;
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
