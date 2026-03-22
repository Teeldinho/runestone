import type { Vector3Tuple } from "@/shared/types";

type RoomDimensions = {
	depth: number;
	height: number;
	width: number;
};

type RoomCenterInput = {
	center: Vector3Tuple;
};

type RoomBoundsInput = RoomCenterInput & {
	dimensions: RoomDimensions;
};

type TorchPositionsInput = RoomCenterInput & {
	height: number;
	inset: number;
};

type RoomLabelPositionInput = RoomCenterInput & {
	heightOffset: number;
};

type RoomBounds = {
	max: Vector3Tuple;
	min: Vector3Tuple;
};

type RoomCorridorAnchors = {
	east: Vector3Tuple;
	north: Vector3Tuple;
	south: Vector3Tuple;
	west: Vector3Tuple;
};

const ROOM_EDGE_DIVISOR = 2;

export const getRoomBounds = ({
	center,
	dimensions,
}: RoomBoundsInput): RoomBounds => {
	const halfWidth = dimensions.width / ROOM_EDGE_DIVISOR;
	const halfHeight = dimensions.height / ROOM_EDGE_DIVISOR;
	const halfDepth = dimensions.depth / ROOM_EDGE_DIVISOR;

	return {
		max: [center[0] + halfWidth, center[1] + halfHeight, center[2] + halfDepth],
		min: [center[0] - halfWidth, center[1] - halfHeight, center[2] - halfDepth],
	};
};

export const getRoomCorridorAnchors = ({
	center,
	dimensions,
}: RoomBoundsInput): RoomCorridorAnchors => {
	const halfWidth = dimensions.width / ROOM_EDGE_DIVISOR;
	const halfDepth = dimensions.depth / ROOM_EDGE_DIVISOR;

	return {
		east: [center[0] + halfWidth, center[1], center[2]],
		north: [center[0], center[1], center[2] - halfDepth],
		south: [center[0], center[1], center[2] + halfDepth],
		west: [center[0] - halfWidth, center[1], center[2]],
	};
};

export const getRoomTorchPositions = ({
	center,
	height,
	inset,
}: TorchPositionsInput): Vector3Tuple[] => {
	return [
		[center[0] - inset, height, center[2] - inset],
		[center[0] + inset, height, center[2] - inset],
		[center[0] - inset, height, center[2] + inset],
		[center[0] + inset, height, center[2] + inset],
	];
};

export const getRoomLabelPosition = ({
	center,
	heightOffset,
}: RoomLabelPositionInput): Vector3Tuple => {
	return [center[0], center[1] + heightOffset, center[2]];
};

export type {
	RoomBounds,
	RoomBoundsInput,
	RoomCorridorAnchors,
	RoomDimensions,
};
