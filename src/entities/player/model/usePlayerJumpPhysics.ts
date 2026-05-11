import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

import { PLAYER_EVENT_TYPES, PLAYER_MOVEMENT_RUNTIME_CONFIG } from "../config";

type UsePlayerJumpPhysicsInput = {
	readonly rigidBodyRef: React.RefObject<RapierRigidBody | null>;
	readonly wantsJumpImpulse: boolean;
	readonly isGrounded: boolean;
	readonly sendPlayer: (event: {
		readonly type: typeof PLAYER_EVENT_TYPES.LANDED;
	}) => void;
};

export const usePlayerJumpPhysics = ({
	rigidBodyRef,
	wantsJumpImpulse,
	isGrounded,
	sendPlayer,
}: UsePlayerJumpPhysicsInput) => {
	const hasAppliedJumpRef = useRef(false);

	useEffect(() => {
		const rigidBody = rigidBodyRef.current;

		if (
			!rigidBody ||
			!wantsJumpImpulse ||
			!isGrounded ||
			hasAppliedJumpRef.current
		) {
			return;
		}

		rigidBody.applyImpulse(
			{
				x: 0,
				y: PLAYER_MOVEMENT_RUNTIME_CONFIG.JUMP_IMPULSE,
				z: 0,
			},
			true,
		);

		hasAppliedJumpRef.current = true;
	}, [isGrounded, rigidBodyRef, wantsJumpImpulse]);

	useEffect(() => {
		if (!isGrounded) {
			return;
		}

		hasAppliedJumpRef.current = false;

		sendPlayer({
			type: PLAYER_EVENT_TYPES.LANDED,
		});
	}, [isGrounded, sendPlayer]);
};
