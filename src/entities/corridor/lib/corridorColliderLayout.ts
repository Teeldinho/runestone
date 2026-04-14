import type { Vector3Tuple } from "@/shared/lib";

type CorridorSideWallCollider = {
	args: [number, number, number];
	position: Vector3Tuple;
	side: "left" | "right";
};

type CorridorSideWallColliderInput = {
	depth: number;
	halfWidth: number;
	wallColliderThickness: number;
	wallHeight: number;
};

export const getCorridorSideWallColliders = ({
	depth,
	halfWidth,
	wallColliderThickness,
	wallHeight,
}: CorridorSideWallColliderInput): CorridorSideWallCollider[] => {
	const wallHalfThickness = wallColliderThickness / 2;
	const wallHalfHeight = wallHeight / 2;
	const depthHalf = depth / 2;

	return [
		{
			side: "left",
			args: [wallHalfThickness, wallHalfHeight, depthHalf],
			position: [-halfWidth, wallHalfHeight, 0],
		},
		{
			side: "right",
			args: [wallHalfThickness, wallHalfHeight, depthHalf],
			position: [halfWidth, wallHalfHeight, 0],
		},
	];
};

export type { CorridorSideWallCollider, CorridorSideWallColliderInput };
