import { ENEMY_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import type { EnemyBehaviorState } from "../config";
import { ENEMY_MACHINE_STATES } from "../config";

type ComputeEnemyMovementInput = {
	behaviorState: EnemyBehaviorState;
	currentPosition: Vector3Tuple;
	targetPosition: Vector3Tuple;
	delta: number;
};

export const computeEnemyMovement = ({
	behaviorState,
	currentPosition,
	targetPosition,
	delta,
}: ComputeEnemyMovementInput): Vector3Tuple => {
	if (
		behaviorState === ENEMY_MACHINE_STATES.DEAD ||
		behaviorState === ENEMY_MACHINE_STATES.ATTACK ||
		behaviorState === ENEMY_MACHINE_STATES.DETECT
	) {
		return currentPosition;
	}

	const speed =
		behaviorState === ENEMY_MACHINE_STATES.CHASE
			? ENEMY_CONFIG.CHASE_SPEED
			: ENEMY_CONFIG.PATROL_SPEED;

	const [cx, cy, cz] = currentPosition;
	const [tx, , tz] = targetPosition;

	const dx = tx - cx;
	const dz = tz - cz;
	const dist = Math.sqrt(dx * dx + dz * dz);

	if (dist < 0.001) {
		return currentPosition;
	}

	const step = Math.min(speed * delta, dist);

	return [cx + (dx / dist) * step, cy, cz + (dz / dist) * step];
};
