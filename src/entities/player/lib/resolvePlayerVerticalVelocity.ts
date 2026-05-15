import { PLAYER_JUMP_CONFIG } from "../config";

type ResolvePlayerVerticalVelocityInput = {
	readonly currentVerticalVelocity: number;
};

export const resolvePlayerVerticalVelocity = ({
	currentVerticalVelocity,
}: ResolvePlayerVerticalVelocityInput): number => {
	if (currentVerticalVelocity >= 0) {
		return currentVerticalVelocity;
	}

	return Math.max(
		PLAYER_JUMP_CONFIG.MAX_FALL_SPEED,
		currentVerticalVelocity * PLAYER_JUMP_CONFIG.FALL_GRAVITY_SCALE,
	);
};
