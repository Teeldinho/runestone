import type { Vector3Tuple } from "@/shared/lib";

type Vector3Coordinates = {
	x: number;
	y: number;
	z: number;
};

type GetPreservedOrbitCameraPositionInput = {
	cameraPosition: Vector3Tuple;
	currentTarget: Vector3Tuple;
	nextTarget: Vector3Tuple;
};

type ResolveOrbitFollowUpdateInput = {
	cameraPosition: Vector3Coordinates;
	currentTarget: Vector3Coordinates;
	nextTarget: Vector3Tuple;
	recenterDistance: number;
};

type CheckOrbitFollowJumpInput = {
	jumpDistance: number;
	nextTarget: Vector3Tuple;
	previousTarget: Vector3Tuple | null;
};

type OrbitFollowUpdate = {
	desiredCameraPosition: Vector3Tuple;
	nextTarget: Vector3Tuple;
};

export const getPreservedOrbitCameraPosition = ({
	cameraPosition,
	currentTarget,
	nextTarget,
}: GetPreservedOrbitCameraPositionInput): Vector3Tuple => {
	const [cameraX, cameraY, cameraZ] = cameraPosition;
	const [currentX, currentY, currentZ] = currentTarget;
	const [nextX, nextY, nextZ] = nextTarget;

	return [
		cameraX + (nextX - currentX),
		cameraY + (nextY - currentY),
		cameraZ + (nextZ - currentZ),
	];
};

export const resolveOrbitFollowUpdate = ({
	cameraPosition,
	currentTarget,
	nextTarget,
	recenterDistance,
}: ResolveOrbitFollowUpdateInput): OrbitFollowUpdate | null => {
	const [nextX, nextY, nextZ] = nextTarget;
	const deltaX = nextX - currentTarget.x;
	const deltaY = nextY - currentTarget.y;
	const deltaZ = nextZ - currentTarget.z;
	const recenterDistanceSquared = recenterDistance * recenterDistance;
	const nextTargetDistanceSquared =
		deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

	if (nextTargetDistanceSquared < recenterDistanceSquared) {
		return null;
	}

	return {
		desiredCameraPosition: [
			cameraPosition.x + deltaX,
			cameraPosition.y + deltaY,
			cameraPosition.z + deltaZ,
		],
		nextTarget,
	};
};

export const checkOrbitFollowJump = ({
	jumpDistance,
	nextTarget,
	previousTarget,
}: CheckOrbitFollowJumpInput): boolean => {
	if (!previousTarget) {
		return false;
	}

	const [nextX, nextY, nextZ] = nextTarget;
	const [previousX, previousY, previousZ] = previousTarget;
	const deltaX = nextX - previousX;
	const deltaY = nextY - previousY;
	const deltaZ = nextZ - previousZ;

	return (
		deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ >=
		jumpDistance * jumpDistance
	);
};

export type {
	CheckOrbitFollowJumpInput,
	GetPreservedOrbitCameraPositionInput,
	OrbitFollowUpdate,
	ResolveOrbitFollowUpdateInput,
	Vector3Coordinates,
};
