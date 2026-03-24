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
};

type UsePlayerPhysicsResult = {
	rigidBodyRef: RefObject<RapierRigidBody | null>;
};

export const usePlayerPhysics = ({
	velocity,
}: UsePlayerPhysicsInput): UsePlayerPhysicsResult => {
	const rigidBodyRef = useRef<RapierRigidBody>(null);

	useFrame((_, delta) => {
		const body = rigidBodyRef.current;
		if (!body) return;

		const teleportTarget = consumePlayerTeleportTarget();
		if (teleportTarget) {
			body.setNextKinematicTranslation({
				x: teleportTarget[0],
				y: teleportTarget[1],
				z: teleportTarget[2],
			});
		}

		const current = body.translation();
		setPlayerPosition(current.x, current.y, current.z);

		const isMoving = velocity[0] !== 0 || velocity[2] !== 0;
		if (!isMoving) return;

		body.setNextKinematicTranslation({
			x: current.x + velocity[0] * PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED * delta,
			y: current.y,
			z: current.z + velocity[2] * PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED * delta,
		});
	});

	return { rigidBodyRef };
};
