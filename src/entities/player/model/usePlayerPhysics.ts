import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";

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

		const isMoving = velocity[0] !== 0 || velocity[2] !== 0;
		if (!isMoving) return;

		const current = body.translation();
		body.setNextKinematicTranslation({
			x: current.x + velocity[0] * PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED * delta,
			y: current.y,
			z: current.z + velocity[2] * PLAYER_ENTITY_CONFIG.MOVEMENT.SPEED * delta,
		});
	});

	return { rigidBodyRef };
};
