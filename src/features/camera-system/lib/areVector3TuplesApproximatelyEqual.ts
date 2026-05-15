import type { Vector3Tuple } from "@/shared/lib";

type AreVector3TuplesApproximatelyEqualInput = {
	readonly left: Vector3Tuple;
	readonly right: Vector3Tuple;
	readonly epsilon: number;
};

export const areVector3TuplesApproximatelyEqual = ({
	left,
	right,
	epsilon,
}: AreVector3TuplesApproximatelyEqualInput): boolean =>
	Math.abs(left[0] - right[0]) <= epsilon &&
	Math.abs(left[1] - right[1]) <= epsilon &&
	Math.abs(left[2] - right[2]) <= epsilon;

export type { AreVector3TuplesApproximatelyEqualInput };
