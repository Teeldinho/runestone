import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

import { PLAYER_EVENT_TYPES, PLAYER_JUMP_CONFIG } from "../config";

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
	const wasGroundedRef = useRef(isGrounded);

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
				y: PLAYER_JUMP_CONFIG.IMPULSE,
				z: 0,
			},
			true,
		);

		hasAppliedJumpRef.current = true;
		wasGroundedRef.current = false;
	}, [isGrounded, rigidBodyRef, wantsJumpImpulse]);

	useEffect(() => {
		const wasGrounded = wasGroundedRef.current;
		const hasJustLanded = !wasGrounded && isGrounded;

		if (!hasJustLanded) {
			wasGroundedRef.current = isGrounded;
			return;
		}

		hasAppliedJumpRef.current = false;
		wasGroundedRef.current = true;

		sendPlayer({
			type: PLAYER_EVENT_TYPES.LANDED,
		});
	}, [isGrounded, sendPlayer]);
};
