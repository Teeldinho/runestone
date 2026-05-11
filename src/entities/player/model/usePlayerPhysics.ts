import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef, useState } from "react";
import type { Vector3Tuple } from "@/shared/lib";
import {
	consumePlayerTeleportTarget,
	getCameraAzimuth,
	getCameraMode,
	setPlayerPosition,
} from "@/shared/lib";

import { PLAYER_GROUNDING_CONFIG } from "../config";
import {
	createSmoothedPlayerPhysicsRotation,
	resolvePlayerPhysicsLinearVelocity,
	resolvePlayerPhysicsTeleportTranslation,
	resolvePlayerVerticalVelocity,
} from "../lib";

type UsePlayerPhysicsInput = {
	velocity: Vector3Tuple;
	isSprinting: boolean;
};

type UsePlayerPhysicsResult = {
	rigidBodyRef: RefObject<RapierRigidBody | null>;
	isGrounded: boolean;
};

export const usePlayerPhysics = ({
	velocity,
	isSprinting,
}: UsePlayerPhysicsInput): UsePlayerPhysicsResult => {
	const rigidBodyRef = useRef<RapierRigidBody>(null);
	const [isGrounded, setIsGrounded] = useState(true);

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
		const nextIsGrounded =
			Math.abs(currentLinvel.y) <
			PLAYER_GROUNDING_CONFIG.VERTICAL_VELOCITY_EPSILON;
		setIsGrounded((previousIsGrounded) =>
			previousIsGrounded === nextIsGrounded
				? previousIsGrounded
				: nextIsGrounded,
		);

		const { horizontalVelocity, isMoving, rotationTarget } =
			resolvePlayerPhysicsLinearVelocity({
				cameraAzimuth: getCameraAzimuth(),
				cameraMode: getCameraMode(),
				isSprinting,
				velocity,
			});

		const nextVerticalVelocity = resolvePlayerVerticalVelocity({
			currentVerticalVelocity: currentLinvel.y,
		});

		if (isMoving && rotationTarget) {
			body.setLinvel(
				{
					x: horizontalVelocity[0],
					y: nextVerticalVelocity,
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

		body.setLinvel({ x: 0, y: nextVerticalVelocity, z: 0 }, true);
	});

	return { rigidBodyRef, isGrounded };
};
