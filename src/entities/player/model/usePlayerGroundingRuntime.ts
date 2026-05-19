import type {
	IntersectionEnterPayload,
	IntersectionExitPayload,
} from "@react-three/rapier";
import { useCallback, useMemo, useRef, useState } from "react";

import { PLAYER_GROUNDING_CONFIG } from "../config";
import {
	addPlayerGroundContactHandle,
	removePlayerGroundContactHandle,
	resolvePlayerGroundContactKey,
	resolvePlayerGroundingMachineEvent,
} from "../lib";
import type {
	PlayerGroundSensorColliderProps,
	PlayerLandedEvent,
	PlayerLeftGroundEvent,
} from "./types";

type PlayerGroundingRuntimeEvent = PlayerLandedEvent | PlayerLeftGroundEvent;

type UsePlayerGroundingRuntimeInput = {
	readonly sendPlayerMachineEvent: (event: PlayerGroundingRuntimeEvent) => void;
};

type UsePlayerGroundingRuntimeResult = {
	readonly groundSensorColliderProps: PlayerGroundSensorColliderProps;
	readonly isGrounded: boolean;
};

export const usePlayerGroundingRuntime = ({
	sendPlayerMachineEvent,
}: UsePlayerGroundingRuntimeInput): UsePlayerGroundingRuntimeResult => {
	const groundContactHandlesRef = useRef<Set<number>>(new Set());
	const isGroundedRef = useRef<boolean>(
		PLAYER_GROUNDING_CONFIG.INITIAL_IS_GROUNDED,
	);
	const [isGrounded, setIsGrounded] = useState<boolean>(
		PLAYER_GROUNDING_CONFIG.INITIAL_IS_GROUNDED,
	);

	const commitGroundContactHandles = useCallback(
		(nextGroundContactHandles: Set<number>) => {
			const previousIsGrounded = isGroundedRef.current;
			const nextIsGrounded = nextGroundContactHandles.size > 0;

			groundContactHandlesRef.current = nextGroundContactHandles;

			if (previousIsGrounded === nextIsGrounded) {
				return;
			}

			isGroundedRef.current = nextIsGrounded;
			setIsGrounded(nextIsGrounded);

			const groundingMachineEvent = resolvePlayerGroundingMachineEvent({
				previousIsGrounded,
				nextIsGrounded,
			});

			if (groundingMachineEvent) {
				sendPlayerMachineEvent(groundingMachineEvent);
			}
		},
		[sendPlayerMachineEvent],
	);

	const handleGroundSensorIntersectionEnter = useCallback(
		(payload: IntersectionEnterPayload) => {
			const contactKey = resolvePlayerGroundContactKey(payload);

			if (contactKey === null) {
				return;
			}

			commitGroundContactHandles(
				addPlayerGroundContactHandle({
					currentGroundContactHandles: groundContactHandlesRef.current,
					groundContactHandle: contactKey,
				}),
			);
		},
		[commitGroundContactHandles],
	);

	const handleGroundSensorIntersectionExit = useCallback(
		(payload: IntersectionExitPayload) => {
			const contactKey = resolvePlayerGroundContactKey(payload);

			if (contactKey === null) {
				return;
			}

			commitGroundContactHandles(
				removePlayerGroundContactHandle({
					currentGroundContactHandles: groundContactHandlesRef.current,
					groundContactHandle: contactKey,
				}),
			);
		},
		[commitGroundContactHandles],
	);

	const groundSensorColliderProps = useMemo<PlayerGroundSensorColliderProps>(
		() => ({
			args: [...PLAYER_GROUNDING_CONFIG.SENSOR_HALF_EXTENTS] as [
				number,
				number,
				number,
			],
			mass: PLAYER_GROUNDING_CONFIG.SENSOR_MASS,
			onIntersectionEnter: handleGroundSensorIntersectionEnter,
			onIntersectionExit: handleGroundSensorIntersectionExit,
			position: [0, PLAYER_GROUNDING_CONFIG.SENSOR_POSITION_Y, 0] as [
				number,
				number,
				number,
			],
			sensor: true,
		}),
		[handleGroundSensorIntersectionEnter, handleGroundSensorIntersectionExit],
	);

	return { groundSensorColliderProps, isGrounded };
};

export type {
	PlayerGroundingRuntimeEvent,
	UsePlayerGroundingRuntimeInput,
	UsePlayerGroundingRuntimeResult,
};
