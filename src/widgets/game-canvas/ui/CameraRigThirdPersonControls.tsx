import { OrbitControls } from "@react-three/drei";
import type React from "react";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { CameraRigOrbitBindings, CameraRigRefs } from "../model";

type CameraRigThirdPersonControlsProps = {
	orbitBindings: CameraRigOrbitBindings;
	refs: CameraRigRefs;
};

export function CameraRigThirdPersonControls({
	orbitBindings,
	refs,
}: CameraRigThirdPersonControlsProps) {
	if (!orbitBindings.shouldRenderOrbitControls) {
		return null;
	}

	return (
		<OrbitControls
			ref={refs.thirdPersonOrbitRef as React.RefObject<never>}
			makeDefault
			enablePan={false}
			enableZoom
			enableRotate
			maxDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE}
			minDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE}
			maxPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_POLAR_ANGLE}
			minPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_POLAR_ANGLE}
			touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
			onStart={orbitBindings.handleOrbitStart}
			onEnd={orbitBindings.handleOrbitEnd}
			domElement={orbitBindings.domElement}
		/>
	);
}

export type { CameraRigThirdPersonControlsProps };
