import { useCallback, useRef } from "react";

import type { Vector3Tuple } from "@/shared/types";

import type { EnemyBehaviorState } from "../config";
import {
	ENEMY_MACHINE_STATES,
	ENEMY_PATROL_RADIUS,
	ENEMY_PATROL_REACH_THRESHOLD,
} from "../config";
import { computeEnemyMovement } from "../lib/computeEnemyMovement";

type UseEnemyMovementInput = {
	behaviorState: EnemyBehaviorState;
	playerPosition: Vector3Tuple;
	patrolCenter: Vector3Tuple;
};

type UseEnemyMovementResult = {
	getNextPosition: (
		delta: number,
		currentPosition: Vector3Tuple,
	) => Vector3Tuple;
};

const pickPatrolWaypoint = (center: Vector3Tuple): Vector3Tuple => {
	const angle = Math.random() * Math.PI * 2;
	const radius = Math.random() * ENEMY_PATROL_RADIUS;
	return [
		center[0] + Math.cos(angle) * radius,
		center[1],
		center[2] + Math.sin(angle) * radius,
	];
};

export const useEnemyMovement = ({
	behaviorState,
	playerPosition,
	patrolCenter,
}: UseEnemyMovementInput): UseEnemyMovementResult => {
	const waypointRef = useRef<Vector3Tuple>(pickPatrolWaypoint(patrolCenter));

	const getNextPosition = useCallback(
		(delta: number, currentPosition: Vector3Tuple): Vector3Tuple => {
			if (behaviorState === ENEMY_MACHINE_STATES.CHASE) {
				return computeEnemyMovement({
					behaviorState,
					currentPosition,
					targetPosition: playerPosition,
					delta,
				});
			}

			if (behaviorState === ENEMY_MACHINE_STATES.PATROL) {
				const [cx, , cz] = currentPosition;
				const [wx, , wz] = waypointRef.current;
				const dist = Math.sqrt((wx - cx) ** 2 + (wz - cz) ** 2);
				if (dist < ENEMY_PATROL_REACH_THRESHOLD) {
					waypointRef.current = pickPatrolWaypoint(patrolCenter);
				}
				return computeEnemyMovement({
					behaviorState,
					currentPosition,
					targetPosition: waypointRef.current,
					delta,
				});
			}

			return currentPosition;
		},
		[behaviorState, playerPosition, patrolCenter],
	);

	return { getNextPosition };
};
