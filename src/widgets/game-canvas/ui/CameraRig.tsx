import { OrbitControls, PointerLockControls } from "@react-three/drei";
import type React from "react";
import * as THREE from "three";

import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

import { CAMERA_RIG_TOUCH_GESTURES } from "../config";
import { useCameraRigViewModel } from "../model/useCameraRigViewModel";

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
	const {
		controlKey,
		freeOrbitalOrbitRef,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
		mode,
		pointerLockRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
		firstPersonOrbitRef,
		isDesktopLayout,
	} = useCameraRigViewModel({
		cameraControlElement,
		cameraStateSnapshot,
		playerSpawnPosition,
	});

	if (mode === CAMERA_MODES.FREE_ORBITAL) {
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

	if (mode === CAMERA_MODES.THIRD_PERSON) {
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

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		if (!isDesktopLayout) {
			// Do not mount until the dom element is available — avoids OrbitControls
			// defaulting to the canvas and stealing joystick touch events.
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
					enableRotate={true}
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

	if (mode === CAMERA_MODES.TOP_DOWN) {
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

	return null;
}
