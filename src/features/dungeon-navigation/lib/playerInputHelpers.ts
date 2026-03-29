import {
	PLAYER_MOVEMENT_DIRECTIONS,
	PLAYER_MOVEMENT_KEY_ALIASES,
	type PlayerMovementKey,
} from "@/entities/player";
import type { Vector3Tuple } from "@/shared/types";

export const getMovementKey = (key: string): PlayerMovementKey | null => {
	return (
		PLAYER_MOVEMENT_KEY_ALIASES[
			key as keyof typeof PLAYER_MOVEMENT_KEY_ALIASES
		] ?? null
	);
};

export const isMovementKey = (key: string): boolean =>
	getMovementKey(key) !== null;

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
