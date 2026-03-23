import {
	PLAYER_MOVEMENT_DIRECTIONS,
	PLAYER_MOVEMENT_KEYS,
	type PlayerMovementKey,
} from "@/entities/player";
import type { Vector3Tuple } from "@/shared/types";

export const isMovementKey = (key: string): key is PlayerMovementKey =>
	Object.values(PLAYER_MOVEMENT_KEYS).includes(key as PlayerMovementKey);

export const computeVelocity = (
	pressedKeys: Set<PlayerMovementKey>,
): Vector3Tuple => {
	let x = 0;
	let z = 0;

	for (const key of pressedKeys) {
		const direction = PLAYER_MOVEMENT_DIRECTIONS[key];
		x += direction[0];
		z += direction[2];
	}

	return [x, 0, z];
};
