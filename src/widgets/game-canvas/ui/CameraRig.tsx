import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import { CAMERA_TRANSITION_MS } from "@/shared/config";

type CameraRigProps = {
	cameraStateSnapshot?: CameraStateSnapshot;
};

const LERP_ALPHA = 1 - Math.exp((-4 * 16) / CAMERA_TRANSITION_MS);
const TARGET_ORIGIN = new THREE.Vector3(0, 0, 0);

export function CameraRig({ cameraStateSnapshot }: CameraRigProps) {
	const { camera } = useThree();
	const perspCamera = camera as THREE.PerspectiveCamera;
	const targetPosition = useRef(new THREE.Vector3());

	useFrame(() => {
		if (!cameraStateSnapshot) return;

		const [tx, ty, tz] = cameraStateSnapshot.position;
		targetPosition.current.set(tx, ty, tz);

		camera.position.lerp(targetPosition.current, LERP_ALPHA);

		if (cameraStateSnapshot.mode !== CAMERA_MODES.FREE_ORBITAL) {
			camera.lookAt(TARGET_ORIGIN);
		}

		const fovDiff = Math.abs(perspCamera.fov - cameraStateSnapshot.fov);
		if (fovDiff > 0.01) {
			perspCamera.fov +=
				(cameraStateSnapshot.fov - perspCamera.fov) * LERP_ALPHA;
			perspCamera.updateProjectionMatrix();
		}
	});

	const isOrbital = cameraStateSnapshot?.mode === CAMERA_MODES.FREE_ORBITAL;

	return isOrbital ? (
		<OrbitControls
			makeDefault
			target={TARGET_ORIGIN}
			minDistance={5}
			maxDistance={28}
			enablePan
		/>
	) : null;
}
