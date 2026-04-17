import { OrbitControls } from "@react-three/drei";
import type React from "react";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import type { OrbitControlsHandle } from "../lib";

type CameraRigTopDownControlsProps = {
	cameraControlElement?: HTMLElement | null;
	controlKey: string | undefined;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
	isDesktopLayout: boolean;
	topDownOrbitRef: React.RefObject<OrbitControlsHandle | null>;
};

export function CameraRigTopDownControls({
	cameraControlElement,
	controlKey,
	handleOrbitEnd,
	handleOrbitStart,
	isDesktopLayout,
	topDownOrbitRef,
}: CameraRigTopDownControlsProps) {
	const topDownPolarAngle = Math.PI / 2;

	return (
		<OrbitControls
			key={controlKey}
			ref={topDownOrbitRef as React.RefObject<never>}
			makeDefault
			enablePan={false}
			enableRotate={false}
			enableZoom
			maxDistance={CAMERA_CONFIG.TOP_DOWN.MAX_DISTANCE}
			maxPolarAngle={topDownPolarAngle}
			minDistance={CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE}
			minPolarAngle={topDownPolarAngle}
			minAzimuthAngle={Math.PI}
			maxAzimuthAngle={Math.PI}
			zoomSpeed={CAMERA_CONFIG.TOP_DOWN.ZOOM_SPEED}
			touches={CAMERA_RIG_TOUCH_GESTURES.TOP_DOWN}
			onStart={handleOrbitStart}
			onEnd={handleOrbitEnd}
			domElement={
				isDesktopLayout ? undefined : (cameraControlElement ?? undefined)
			}
		/>
	);
}

export type { CameraRigTopDownControlsProps };
