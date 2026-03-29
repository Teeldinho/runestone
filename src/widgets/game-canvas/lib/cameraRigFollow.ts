import type { Vector3Tuple } from "@/shared/types";

type GetPreservedOrbitCameraPositionInput = {
	cameraPosition: Vector3Tuple;
	currentTarget: Vector3Tuple;
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

export type { GetPreservedOrbitCameraPositionInput };
