const ORIGIN = 0;

export type Vec3 = readonly [number, number, number];

export function addVec3(a: Vec3, b: Vec3): Vec3 {
	return [a[ORIGIN] + b[ORIGIN], a[1] + b[1], a[2] + b[2]];
}

export function subtractVec3(a: Vec3, b: Vec3): Vec3 {
	return [a[ORIGIN] - b[ORIGIN], a[1] - b[1], a[2] - b[2]];
}

export function scaleVec3(vector: Vec3, scalar: number): Vec3 {
	return [vector[ORIGIN] * scalar, vector[1] * scalar, vector[2] * scalar];
}

export function lengthVec3(vector: Vec3) {
	return Math.hypot(vector[ORIGIN], vector[1], vector[2]);
}

export function distanceVec3(a: Vec3, b: Vec3) {
	return lengthVec3(subtractVec3(b, a));
}

export function normalizeVec3(vector: Vec3): Vec3 {
	const magnitude = lengthVec3(vector);

	if (magnitude === ORIGIN) {
		return [ORIGIN, ORIGIN, ORIGIN];
	}

	return scaleVec3(vector, 1 / magnitude);
}
