import { OrbitControls } from "@react-three/drei";
import type React from "react";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { OrbitControlsHandle } from "../lib";

type CameraRigThirdPersonControlsProps = {
	cameraControlElement?: HTMLElement | null;
	controlKey: string | undefined;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
	isDesktopLayout: boolean;
	thirdPersonOrbitRef: React.RefObject<OrbitControlsHandle | null>;
};

export function CameraRigThirdPersonControls({
	cameraControlElement,
	controlKey,
	handleOrbitEnd,
	handleOrbitStart,
	isDesktopLayout,
	thirdPersonOrbitRef,
}: CameraRigThirdPersonControlsProps) {
	return (
		<OrbitControls
			key={controlKey}
			ref={thirdPersonOrbitRef as React.RefObject<never>}
			makeDefault
			enablePan
			enableZoom
			enableRotate
			maxDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE}
			minDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE}
			maxPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_POLAR_ANGLE}
			minPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_POLAR_ANGLE}
			touches={CAMERA_RIG_TOUCH_GESTURES.ORBIT}
			onStart={handleOrbitStart}
			onEnd={handleOrbitEnd}
			domElement={
				isDesktopLayout ? undefined : (cameraControlElement ?? undefined)
			}
		/>
	);
}

export type { CameraRigThirdPersonControlsProps };
