import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import * as THREE from "three";

import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_CONFIG, CAMERA_TRANSITION_MS } from "@/shared/config";
import { setCameraMode } from "@/shared/lib/cameraModeStore";
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
	const pointerLockRef =
		useRef<
			Parameters<typeof PointerLockControls>[0]["ref"] extends React.RefObject<
				infer T
			>
				? T
				: never
		>(null);

	const handleFirstPersonLock = useCallback(() => {
		// Pointer locked
	}, []);

	const handleFirstPersonUnlock = useCallback(() => {
		// Pointer unlocked
	}, []);

	useFrame(() => {
		if (!cameraStateSnapshot) return;

		setCameraMode(cameraStateSnapshot.mode);

		const [px, py, pz] = getPlayerPosition();

		if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			targetPosition.current.set(px, py + 1.6, pz);
			targetLookAt.current.set(px, py + 1.6, pz - 1);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON) {
			const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;
			targetPosition.current.set(px + ox, py + oy, pz + oz);
			targetLookAt.current.set(px, py + 1, pz);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.TOP_DOWN) {
			targetPosition.current.set(
				px,
				CAMERA_CONFIG.TOP_DOWN.HEIGHT,
				pz + CAMERA_CONFIG.TOP_DOWN.DISTANCE,
			);
			targetLookAt.current.set(px, 0, pz);
		} else {
			const [sx, sy, sz] = cameraStateSnapshot.position;
			targetPosition.current.set(sx, sy, sz);
			const [tx, ty, tz] = cameraStateSnapshot.target;
			targetLookAt.current.set(tx, ty, tz);
		}

		if (cameraStateSnapshot.mode !== CAMERA_MODES.FREE_ORBITAL) {
			camera.position.lerp(targetPosition.current, LERP_ALPHA);
			camera.lookAt(targetLookAt.current);
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
				target={[0, 0, 0]}
				minDistance={CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE}
				maxDistance={CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE}
				enablePan
			/>
		);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return (
			<PointerLockControls
				ref={pointerLockRef}
				onLock={handleFirstPersonLock}
				onUnlock={handleFirstPersonUnlock}
			/>
		);
	}

	return null;
}
