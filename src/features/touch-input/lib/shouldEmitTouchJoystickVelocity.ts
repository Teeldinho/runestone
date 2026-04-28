import type { Vector3Tuple } from "@/shared/lib";

type ShouldEmitTouchJoystickVelocityInput = {
	nextVelocity: Vector3Tuple;
	previousVelocity: Vector3Tuple | null;
	threshold: number;
};

export const shouldEmitTouchJoystickVelocity = ({
	nextVelocity,
	previousVelocity,
	threshold,
}: ShouldEmitTouchJoystickVelocityInput): boolean => {
	if (previousVelocity === null) {
		return true;
	}

	return nextVelocity.some(
		(velocityComponent, index) =>
			Math.abs(velocityComponent - previousVelocity[index]) > threshold,
	);
};

export type { ShouldEmitTouchJoystickVelocityInput };
