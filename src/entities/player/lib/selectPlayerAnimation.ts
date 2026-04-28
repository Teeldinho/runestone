import type { Vector3Tuple } from "@/shared/lib";
import { PLAYER_STATES } from "../config";
import { PLAYER_ANIMATION_NAMES } from "../config/playerGltfConfig";

export const selectPlayerAnimation = (
	velocity: Vector3Tuple,
	isSprinting: boolean,
	healthState: string,
): string => {
	if (healthState === PLAYER_STATES.HEALTH.DEAD) {
		return PLAYER_ANIMATION_NAMES.DEATH;
	}
	const isMoving = velocity[0] !== 0 || velocity[2] !== 0;
	if (isMoving && isSprinting) {
		return PLAYER_ANIMATION_NAMES.RUN;
	}
	if (isMoving) {
		return PLAYER_ANIMATION_NAMES.WALK;
	}
	return PLAYER_ANIMATION_NAMES.IDLE;
};
