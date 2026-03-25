import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";
import { RELATIVE_CAMERA_MODES } from "@/shared/config";
import { getCameraMode } from "@/shared/lib/cameraModeStore";
import { getCameraAzimuth } from "@/shared/lib/cameraOrientationStore";
import {
	consumePlayerTeleportTarget,
	setPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import { PLAYER_ENTITY_CONFIG } from "../config";

type UsePlayerPhysicsInput = {
	position: Vector3Tuple;
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

	useFrame(() => {
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

			let vx = velocity[0] * speed;
			let vz = velocity[2] * speed;

			if (isRelativeMode) {
				const azimuth = getCameraAzimuth();
				const cos = Math.cos(azimuth);
				const sin = Math.sin(azimuth);
				vx = (velocity[0] * cos + velocity[2] * sin) * speed;
				vz = (-velocity[0] * sin + velocity[2] * cos) * speed;
			}

			body.setLinvel(
				{
					x: vx,
					y: currentLinvel.y,
					z: vz,
				},
				true,
			);
		}
	});

	return { rigidBodyRef };
};
