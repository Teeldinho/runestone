import type { Vector3Tuple } from "@/shared/lib";

const VECTOR_X_INDEX = 0;
const VECTOR_Z_INDEX = 2;

type ResolveTouchVelocityMagnitudeInput = {
	readonly velocity: Vector3Tuple;
};

export const resolveTouchVelocityMagnitude = ({
	velocity,
}: ResolveTouchVelocityMagnitudeInput): number => {
	const x = velocity[VECTOR_X_INDEX];
	const z = velocity[VECTOR_Z_INDEX];

	return Math.hypot(x, z);
};
