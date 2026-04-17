import { OrbitControls, PointerLockControls } from "@react-three/drei";
import type React from "react";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { OrbitControlsHandle } from "../lib";
import type { PointerLockControlsHandle } from "../model/useCameraRigViewModel";

type CameraRigFirstPersonControlsProps = {
	controlKey: string | undefined;
	firstPersonLookElement?: HTMLElement | null;
	firstPersonOrbitRef: React.RefObject<OrbitControlsHandle | null>;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
	isDesktopLayout: boolean;
	pointerLockRef: React.RefObject<PointerLockControlsHandle | null>;
};

export function CameraRigFirstPersonControls({
	controlKey,
	firstPersonLookElement,
	firstPersonOrbitRef,
	handleFirstPersonLock,
	handleFirstPersonUnlock,
	handleOrbitEnd,
	handleOrbitStart,
	isDesktopLayout,
	pointerLockRef,
}: CameraRigFirstPersonControlsProps) {
	if (!isDesktopLayout) {
		if (!firstPersonLookElement) {
			return null;
		}

		return (
			<OrbitControls
				key={controlKey}
				ref={firstPersonOrbitRef as React.RefObject<never>}
				makeDefault
				enablePan={false}
				enableZoom={false}
				enableRotate
				minDistance={0.01}
				maxDistance={0.01}
				touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
				onStart={handleOrbitStart}
				onEnd={handleOrbitEnd}
				domElement={firstPersonLookElement}
			/>
		);
	}

	return (
		<PointerLockControls
			key={controlKey}
			ref={pointerLockRef as React.RefObject<never>}
			selector="#game-canvas-fp-lock"
			onLock={handleFirstPersonLock}
			onUnlock={handleFirstPersonUnlock}
		/>
	);
}

export type { CameraRigFirstPersonControlsProps };
