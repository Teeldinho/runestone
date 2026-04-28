import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";
import type { Vector3Tuple } from "@/shared/lib";
import {
	consumePlayerTeleportTarget,
	getCameraAzimuth,
	getCameraMode,
	setPlayerPosition,
} from "@/shared/lib";

import {
	createSmoothedPlayerPhysicsRotation,
	resolvePlayerPhysicsLinearVelocity,
	resolvePlayerPhysicsTeleportTranslation,
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

	useFrame((_, delta) => {
		const body = rigidBodyRef.current;
		if (!body) return;

		const teleportTarget = consumePlayerTeleportTarget();
		if (teleportTarget) {
			body.setTranslation(
				resolvePlayerPhysicsTeleportTranslation(teleportTarget),
				true,
			);
			body.setLinvel({ x: 0, y: 0, z: 0 }, true);
		}

		const current = body.translation();
		setPlayerPosition(current.x, current.y, current.z);

		const currentLinvel = body.linvel();
		const { horizontalVelocity, isMoving, rotationTarget } =
			resolvePlayerPhysicsLinearVelocity({
				cameraAzimuth: getCameraAzimuth(),
				cameraMode: getCameraMode(),
				isSprinting,
				velocity,
			});

		if (isMoving && rotationTarget) {
			body.setLinvel(
				{
					x: horizontalVelocity[0],
					y: currentLinvel.y,
					z: horizontalVelocity[2],
				},
				true,
			);
			body.setRotation(
				createSmoothedPlayerPhysicsRotation({
					currentRotation: body.rotation(),
					delta,
					rotationTarget,
				}),
				true,
			);

			return;
		}

		body.setLinvel({ x: 0, y: currentLinvel.y, z: 0 }, true);
	});

	return { rigidBodyRef };
};
