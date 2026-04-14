import type { Vector3Tuple } from "@/shared/lib";

type TorchPosition = [number, number, number];

type CreateRoomTorchPositionsInput = {
	localTorchPositions: readonly Vector3Tuple[];
	roomPositions: readonly Vector3Tuple[];
};

const translateTorchPosition = (
	roomPosition: Vector3Tuple,
	localTorchPosition: Vector3Tuple,
): TorchPosition => {
	return [
		roomPosition[0] + localTorchPosition[0],
		roomPosition[1] + localTorchPosition[1],
		roomPosition[2] + localTorchPosition[2],
	];
};

export const createRoomTorchPositions = ({
	localTorchPositions,
	roomPositions,
}: CreateRoomTorchPositionsInput): TorchPosition[] => {
	return roomPositions.flatMap((roomPosition) => {
		return localTorchPositions.map((localTorchPosition) => {
			return translateTorchPosition(roomPosition, localTorchPosition);
		});
	});
};

export type { CreateRoomTorchPositionsInput, TorchPosition };
