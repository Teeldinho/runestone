import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type React from "react";
import { useCallback, useRef } from "react";
import * as THREE from "three";

import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_CONFIG, CAMERA_TRANSITION_MS } from "@/shared/config";
import { setCameraMode } from "@/shared/lib/cameraModeStore";
import { setCameraAzimuth } from "@/shared/lib/cameraOrientationStore";
import { getPlayerPosition } from "@/shared/lib/playerPositionStore";

type CameraRigProps = {
	cameraStateSnapshot?: CameraStateSnapshot;
};

const LERP_ALPHA = 1 - Math.exp((-4 * 16) / CAMERA_TRANSITION_MS);

export function CameraRig({ cameraStateSnapshot }: CameraRigProps) {
	const { camera } = useThree();
	const perspCamera = camera as THREE.PerspectiveCamera;
	const targetPosition = useRef(new THREE.Vector3());
	const targetLookAt = useRef(new THREE.Vector3());
	const prevModeRef = useRef<string | undefined>(undefined);
	const pointerLockRef = useRef<{ isLocked: boolean } | null>(null);
	const thirdPersonOrbitRef = useRef<{
		target: THREE.Vector3;
		update: () => void;
	} | null>(null);

	const handleFirstPersonLock = useCallback(() => {
		// Pointer locked
	}, []);

	const handleFirstPersonUnlock = useCallback(() => {
		// Pointer unlocked
	}, []);

	useFrame(() => {
		if (!cameraStateSnapshot) return;

		setCameraMode(cameraStateSnapshot.mode);

		const isModeChange = cameraStateSnapshot.mode !== prevModeRef.current;
		prevModeRef.current = cameraStateSnapshot.mode;

		const [px, py, pz] = getPlayerPosition();

		if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			targetPosition.current.set(px, py + 1.6, pz);
			targetLookAt.current.set(px, py + 1.6, pz + 1);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON) {
			const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;
			targetPosition.current.set(px + ox, py + oy, pz + oz);
			targetLookAt.current.set(px, py + 1, pz);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.TOP_DOWN) {
			if (isModeChange) {
				camera.up.set(0, 1, 0);
			}
			targetPosition.current.set(
				px,
				CAMERA_CONFIG.TOP_DOWN.HEIGHT,
				pz + CAMERA_CONFIG.TOP_DOWN.DISTANCE,
			);
			targetLookAt.current.set(px, py, pz);
		} else {
			const [sx, sy, sz] = cameraStateSnapshot.position;
			targetPosition.current.set(sx, sy, sz);
			const [tx, ty, tz] = cameraStateSnapshot.target;
			targetLookAt.current.set(tx, ty, tz);
		}

		if (
			cameraStateSnapshot.mode !== CAMERA_MODES.FREE_ORBITAL &&
			cameraStateSnapshot.mode !== CAMERA_MODES.FIRST_PERSON &&
			cameraStateSnapshot.mode !== CAMERA_MODES.THIRD_PERSON
		) {
			if (isModeChange) {
				camera.position.copy(targetPosition.current);
			} else {
				camera.position.lerp(targetPosition.current, LERP_ALPHA);
			}
			camera.lookAt(targetLookAt.current);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			if (isModeChange) {
				camera.position.copy(targetPosition.current);
			} else {
				camera.position.lerp(targetPosition.current, LERP_ALPHA);
			}
			if (!pointerLockRef.current?.isLocked) {
				camera.lookAt(targetLookAt.current);
			}
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON) {
			const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;
			if (thirdPersonOrbitRef.current) {
				if (isModeChange) {
					camera.position.set(px + ox, py + oy, pz + oz);
				}
				thirdPersonOrbitRef.current.target.set(px, py + 1, pz);
				thirdPersonOrbitRef.current.update();
			} else if (isModeChange) {
				camera.position.copy(targetPosition.current);
			}
		}

		const dir = new THREE.Vector3();
		camera.getWorldDirection(dir);
		dir.y = 0;
		if (dir.lengthSq() > 0) {
			setCameraAzimuth(Math.atan2(dir.x, dir.z));
		}

		const fovDiff = Math.abs(perspCamera.fov - cameraStateSnapshot.fov);
		if (fovDiff > 0.01) {
			perspCamera.fov +=
				(cameraStateSnapshot.fov - perspCamera.fov) * LERP_ALPHA;
			perspCamera.updateProjectionMatrix();
		}
	});

	const mode = cameraStateSnapshot?.mode;

	if (mode === CAMERA_MODES.FREE_ORBITAL) {
		return (
			<OrbitControls
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
				mouseButtons={{
					LEFT: THREE.MOUSE.PAN,
					MIDDLE: THREE.MOUSE.DOLLY,
					RIGHT: THREE.MOUSE.ROTATE,
				}}
			/>
		);
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		return (
			<OrbitControls
				ref={thirdPersonOrbitRef as React.RefObject<never>}
				makeDefault
				enablePan
				enableZoom
				enableRotate
				maxDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE}
				minDistance={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE}
				maxPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_POLAR_ANGLE}
				minPolarAngle={CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_POLAR_ANGLE}
			/>
		);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return (
			<PointerLockControls
				ref={pointerLockRef as React.RefObject<never>}
				selector="#game-canvas-fp-lock"
				onLock={handleFirstPersonLock}
				onUnlock={handleFirstPersonUnlock}
			/>
		);
	}

	return null;
}
