import type { Vector3Tuple } from "@/shared/lib";

export const normalizeMovementVelocity = (
	velocity: Vector3Tuple,
): Vector3Tuple => {
	const [x, y, z] = velocity;
	const magnitude = Math.hypot(x, z);

	if (magnitude === 0) {
		return [0, y, 0];
	}

	return [x / magnitude, y, z / magnitude];
};

export const rotateVelocityByCameraAzimuth = (
	velocity: Vector3Tuple,
	azimuth: number,
): Vector3Tuple => {
	const [x, y, z] = velocity;
	const relativeAzimuth = Math.PI - azimuth;
	const cos = Math.cos(relativeAzimuth);
	const sin = Math.sin(relativeAzimuth);

	return [x * cos - z * sin, y, x * sin + z * cos];
};
