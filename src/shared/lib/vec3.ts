import * as THREE from "three";

export type Vec3 = readonly [number, number, number];

export function addVec3(a: Vec3, b: Vec3): Vec3 {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function subtractVec3(a: Vec3, b: Vec3): Vec3 {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scaleVec3(vector: Vec3, scalar: number): Vec3 {
	return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
}

export function lengthVec3(vector: Vec3) {
	return Math.hypot(vector[0], vector[1], vector[2]);
}

export function distanceVec3(a: Vec3, b: Vec3) {
	return lengthVec3(subtractVec3(b, a));
}

export function normalizeVec3(vector: Vec3): Vec3 {
	const magnitude = lengthVec3(vector);

	if (magnitude === 0) {
		return [0, 0, 0];
	}

	return scaleVec3(vector, 1 / magnitude);
}

export function getQuaternionFromXZ(x: number, z: number): THREE.Quaternion {
	const angle = Math.atan2(x, z);
	return new THREE.Quaternion().setFromAxisAngle(
		new THREE.Vector3(0, 1, 0),
		angle,
	);
}
