import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { RELATIVE_CAMERA_MODES } from "@/shared/config";
import { getCameraMode } from "@/shared/lib/cameraModeStore";
import { getCameraAzimuth } from "@/shared/lib/cameraOrientationStore";
import {
	consumePlayerTeleportTarget,
	setPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import { getQuaternionFromXZ } from "@/shared/lib/vec3";
import type { Vector3Tuple } from "@/shared/types";

import { PLAYER_ENTITY_CONFIG } from "../config";
import {
	normalizeMovementVelocity,
	rotateVelocityByCameraAzimuth,
} from "../lib";

type UsePlayerPhysicsInput = {
	velocity: Vector3Tuple;
	isSprinting: boolean;
};

type UsePlayerPhysicsResult = {
	rigidBodyRef: RefObject<RapierRigidBody | null>;
};

export const usePlayerPhysics = ({
	velocity,
	isSprinting,
}: UsePlayerPhysicsInput): UsePlayerPhysicsResult => {
	const rigidBodyRef = useRef<RapierRigidBody>(null);
	const targetRotationRef = useRef(new THREE.Quaternion());
	const currentRotationRef = useRef(new THREE.Quaternion());

	useFrame((_, delta) => {
		const body = rigidBodyRef.current;
		if (!body) return;

		const teleportTarget = consumePlayerTeleportTarget();
		if (teleportTarget) {
			body.setTranslation(
				{
					x: teleportTarget[0],
					y: teleportTarget[1],
					z: teleportTarget[2],
				},
				true,
			);
			body.setLinvel({ x: 0, y: 0, z: 0 }, true);
		}

		const current = body.translation();
		setPlayerPosition(current.x, current.y, current.z);

		const isMoving = velocity[0] !== 0 || velocity[2] !== 0;
		const speed = isSprinting
			? PLAYER_ENTITY_CONFIG.MOVEMENT.SPRINT_SPEED
			: PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED;

		if (isMoving) {
			const currentLinvel = body.linvel();
			const mode = getCameraMode();
			const isRelativeMode = (
				RELATIVE_CAMERA_MODES as ReadonlyArray<string>
			).includes(mode);
			const normalizedVelocity = normalizeMovementVelocity(velocity);

			let vx = normalizedVelocity[0] * speed;
			let vz = normalizedVelocity[2] * speed;

			if (isRelativeMode) {
				const [rotatedX, , rotatedZ] = rotateVelocityByCameraAzimuth(
					normalizedVelocity,
					getCameraAzimuth(),
				);
				vx = rotatedX * speed;
				vz = rotatedZ * speed;
			}

			body.setLinvel(
				{
					x: vx,
					y: currentLinvel.y,
					z: vz,
				},
				true,
			);

			// Rotate toward movement direction
			targetRotationRef.current.copy(getQuaternionFromXZ(vx, vz));
			currentRotationRef.current.copy(body.rotation() as THREE.Quaternion);
			currentRotationRef.current.slerp(
				targetRotationRef.current,
				PLAYER_ENTITY_CONFIG.MOVEMENT.ROTATION_SPEED * delta,
			);
			body.setRotation(currentRotationRef.current, true);

			return;
		}

		const currentLinvel = body.linvel();
		body.setLinvel({ x: 0, y: currentLinvel.y, z: 0 }, true);
	});

	return { rigidBodyRef };
};
