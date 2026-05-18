import type { Vector3Tuple } from "@/shared/lib";

const VELOCITY_X_INDEX = 0;
const VELOCITY_Z_INDEX = 2;

type ResolveMovementVelocityMagnitudeInput = {
	readonly velocity: Vector3Tuple;
};

export const resolveMovementVelocityMagnitude = ({
	velocity,
}: ResolveMovementVelocityMagnitudeInput): number => {
	const x = velocity[VELOCITY_X_INDEX];
	const z = velocity[VELOCITY_Z_INDEX];

	return Math.hypot(x, z);
};

export type { ResolveMovementVelocityMagnitudeInput };
