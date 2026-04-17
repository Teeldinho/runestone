import { OrbitControls } from "@react-three/drei";
import type React from "react";
import * as THREE from "three";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { OrbitControlsHandle } from "../lib";

type CameraRigFreeOrbitalControlsProps = {
	cameraControlElement?: HTMLElement | null;
	controlKey: string | undefined;
	freeOrbitalOrbitRef: React.RefObject<OrbitControlsHandle | null>;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
	isDesktopLayout: boolean;
};

export function CameraRigFreeOrbitalControls({
	cameraControlElement,
	controlKey,
	freeOrbitalOrbitRef,
	handleOrbitEnd,
	handleOrbitStart,
	isDesktopLayout,
}: CameraRigFreeOrbitalControlsProps) {
	return (
		<OrbitControls
			key={controlKey}
			ref={freeOrbitalOrbitRef as React.RefObject<never>}
			makeDefault
			enablePan
			enableRotate
			enableZoom
			maxDistance={CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE}
			maxPolarAngle={CAMERA_CONFIG.FREE_ORBITAL.MAX_POLAR_ANGLE}
			minDistance={CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE}
			minPolarAngle={CAMERA_CONFIG.FREE_ORBITAL.MIN_POLAR_ANGLE}
			panSpeed={CAMERA_CONFIG.FREE_ORBITAL.PAN_SPEED}
			rotateSpeed={CAMERA_CONFIG.FREE_ORBITAL.ROTATE_SPEED}
			screenSpacePanning
			zoomSpeed={CAMERA_CONFIG.FREE_ORBITAL.ZOOM_SPEED}
			onStart={handleOrbitStart}
			onEnd={handleOrbitEnd}
			mouseButtons={{
				LEFT: THREE.MOUSE.PAN,
				MIDDLE: THREE.MOUSE.DOLLY,
				RIGHT: THREE.MOUSE.ROTATE,
			}}
			touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
			domElement={
				isDesktopLayout ? undefined : (cameraControlElement ?? undefined)
			}
		/>
	);
}

export type { CameraRigFreeOrbitalControlsProps };
