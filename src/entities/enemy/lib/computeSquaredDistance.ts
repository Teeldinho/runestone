import type { Vector3Tuple } from "@/shared/lib";

export const computeSquaredDistance = (
	a: Vector3Tuple,
	b: Vector3Tuple,
): number => {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	const dz = a[2] - b[2];
	return dx * dx + dy * dy + dz * dz;
};
