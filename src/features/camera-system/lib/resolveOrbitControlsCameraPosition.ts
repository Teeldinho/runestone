import type { Vector3Tuple } from "@/shared/lib";

type ResolveOrbitControlsCameraPositionInput = {
	readonly cameraPosition: Vector3Tuple;
	readonly currentTarget: Vector3Tuple;
	readonly nextTarget: Vector3Tuple;
};

export const resolveOrbitControlsCameraPosition = ({
	cameraPosition,
	currentTarget,
	nextTarget,
}: ResolveOrbitControlsCameraPositionInput): Vector3Tuple => {
	const [cameraX, cameraY, cameraZ] = cameraPosition;
	const [currentX, currentY, currentZ] = currentTarget;
	const [nextX, nextY, nextZ] = nextTarget;

	return [
		cameraX + (nextX - currentX),
		cameraY + (nextY - currentY),
		cameraZ + (nextZ - currentZ),
	];
};
