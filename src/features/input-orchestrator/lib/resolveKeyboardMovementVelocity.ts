import {
	PLAYER_MOVEMENT_DIRECTIONS,
	type PlayerMovementKey,
} from "@/entities/player";
import type { Vector3Tuple } from "@/shared/lib";

type ResolveKeyboardMovementVelocityInput = {
	readonly pressedKeys: ReadonlySet<PlayerMovementKey>;
};

export const resolveKeyboardMovementVelocity = ({
	pressedKeys,
}: ResolveKeyboardMovementVelocityInput): Vector3Tuple => {
	let x = 0;
	let z = 0;

	for (const key of pressedKeys) {
		const direction = PLAYER_MOVEMENT_DIRECTIONS[key];

		x += direction[0];
		z += direction[2];
	}

	return [x, 0, z];
};

export type { ResolveKeyboardMovementVelocityInput };
