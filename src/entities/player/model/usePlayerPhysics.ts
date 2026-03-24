import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";

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
		const currentLinvel = body.linvel();

		if (isMoving) {
			body.setLinvel(
				{
					x: velocity[0] * speed,
					y: currentLinvel.y,
					z: velocity[2] * speed,
				},
				true,
			);
		} else {
			body.setLinvel({ x: 0, y: currentLinvel.y, z: 0 }, true);
		}
	});

	return { rigidBodyRef };
};
