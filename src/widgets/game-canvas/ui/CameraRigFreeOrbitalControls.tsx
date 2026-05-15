import { OrbitControls } from "@react-three/drei";
import type React from "react";
import * as THREE from "three";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { CameraRigOrbitBindings, CameraRigRefs } from "../model";

type CameraRigFreeOrbitalControlsProps = {
	orbitBindings: CameraRigOrbitBindings;
	refs: CameraRigRefs;
};

export function CameraRigFreeOrbitalControls({
	orbitBindings,
	refs,
}: CameraRigFreeOrbitalControlsProps) {
	if (!orbitBindings.shouldRenderOrbitControls) {
		return null;
	}

	return (
		<OrbitControls
			ref={refs.freeOrbitalOrbitRef as React.RefObject<never>}
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
			onStart={orbitBindings.handleOrbitStart}
			onEnd={orbitBindings.handleOrbitEnd}
			mouseButtons={{
				LEFT: THREE.MOUSE.PAN,
				MIDDLE: THREE.MOUSE.DOLLY,
				RIGHT: THREE.MOUSE.ROTATE,
			}}
			touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
			domElement={orbitBindings.domElement}
		/>
	);
}

export type { CameraRigFreeOrbitalControlsProps };
