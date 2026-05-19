import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { PLAYER_JUMP_CONFIG } from "../config";

type UsePlayerJumpPhysicsInput = {
	readonly rigidBodyRef: RefObject<RapierRigidBody | null>;
	readonly wantsJumpImpulse: boolean;
	readonly isGrounded: boolean;
};

export const usePlayerJumpPhysics = ({
	rigidBodyRef,
	wantsJumpImpulse,
	isGrounded,
}: UsePlayerJumpPhysicsInput) => {
	const hasAppliedJumpRef = useRef(false);

	useEffect(() => {
		if (!wantsJumpImpulse) {
			hasAppliedJumpRef.current = false;
			return;
		}

		if (!isGrounded) {
			return;
		}

		const rigidBody = rigidBodyRef.current;

		if (!rigidBody || hasAppliedJumpRef.current) {
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
	}, [isGrounded, rigidBodyRef, wantsJumpImpulse]);
};
