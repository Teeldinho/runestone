import { OrbitControls } from "@react-three/drei";
import type React from "react";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { CameraRigOrbitBindings, CameraRigRefs } from "../model";

type CameraRigTopDownControlsProps = {
	orbitBindings: CameraRigOrbitBindings;
	refs: CameraRigRefs;
};

export function CameraRigTopDownControls({
	orbitBindings,
	refs,
}: CameraRigTopDownControlsProps) {
	if (!orbitBindings.shouldRenderOrbitControls) {
		return null;
	}

	return (
		<OrbitControls
			ref={refs.topDownOrbitRef as React.RefObject<never>}
			makeDefault
			enablePan={false}
			enableRotate={false}
			enableZoom
			maxDistance={CAMERA_CONFIG.TOP_DOWN.MAX_DISTANCE}
			maxPolarAngle={CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE}
			minDistance={CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE}
			minPolarAngle={CAMERA_CONFIG.TOP_DOWN.POLAR_ANGLE}
			minAzimuthAngle={CAMERA_CONFIG.TOP_DOWN.LOCKED_AZIMUTH_ANGLE}
			maxAzimuthAngle={CAMERA_CONFIG.TOP_DOWN.LOCKED_AZIMUTH_ANGLE}
			zoomSpeed={CAMERA_CONFIG.TOP_DOWN.ZOOM_SPEED}
			touches={CAMERA_RIG_TOUCH_GESTURES.TOP_DOWN}
			onStart={orbitBindings.handleOrbitStart}
			onEnd={orbitBindings.handleOrbitEnd}
			domElement={orbitBindings.domElement}
		/>
	);
}

export type { CameraRigTopDownControlsProps };
