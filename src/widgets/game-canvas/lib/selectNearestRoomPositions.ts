import type { Vector3Tuple } from "@/shared/types";

type SelectNearestRoomPositionsInput = {
	roomPositions: readonly Vector3Tuple[];
	currentRoomPosition: Vector3Tuple | null;
	maxRoomCount: number;
};

const getHorizontalDistanceSquared = (
	from: Vector3Tuple,
	to: Vector3Tuple,
): number => {
	const dx = to[0] - from[0];
	const dz = to[2] - from[2];

	return dx * dx + dz * dz;
};

export const selectNearestRoomPositions = ({
	roomPositions,
	currentRoomPosition,
	maxRoomCount,
}: SelectNearestRoomPositionsInput): Vector3Tuple[] => {
	if (maxRoomCount <= 0 || roomPositions.length === 0) {
		return [];
	}

	if (!currentRoomPosition) {
		return [...roomPositions].slice(0, maxRoomCount);
	}

	return [...roomPositions]
		.sort((left, right) => {
			return (
				getHorizontalDistanceSquared(currentRoomPosition, left) -
				getHorizontalDistanceSquared(currentRoomPosition, right)
			);
		})
		.slice(0, maxRoomCount);
};

export type { SelectNearestRoomPositionsInput };
