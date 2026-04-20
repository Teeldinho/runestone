import type { RoomWallSide } from "../config";
import { ROOM_GLTF_CONFIG, ROOM_WALL_LAYOUT } from "../config";
import {
	getDoorColliderHalfArgs,
	getDoorColliderPosition,
	getDoorMeshArgs,
	getDoorwayPosition,
	getTorchPosition,
	getWallBoxArgs,
	getWallMeshPosition,
	getWallOffsetValue,
	getWallTilePosition,
	hasOpening,
	isDoorLocked,
	shouldRenderCollider,
} from "../lib";
import type { RoomDoorConfig, RoomWallOpening } from "./types";

type UseRoomWallSegmentInput = {
	side: RoomWallSide;
	doorConfig: RoomDoorConfig;
};

type UseRoomWallSegmentResult = {
	rotationY: number;
	isNorthSouth: boolean;
	hasDoor: boolean;
	renderCollider: boolean;
	locked: boolean;
	colliderHalfArgs: [number, number, number];
	doorMeshArgs: [number, number, number];
	wallBoxArgs: [number, number, number];
	colliderPosition: [number, number, number];
	doorwayPosition: [number, number, number];
	wallOffsetValue: number;
	doorwayScale: readonly [number, number, number];
	wallScale: readonly [number, number, number];
	torchScale: readonly [number, number, number];
	getWallPosition: (tilePos: number) => [number, number, number];
	getWallMeshPos: (tilePos: number) => [number, number, number];
	getTorchPos: (tilePos: number) => [number, number, number];
};

export const useRoomWallSegment = ({
	side,
	doorConfig,
}: UseRoomWallSegmentInput): UseRoomWallSegmentResult => {
	const layout = ROOM_WALL_LAYOUT[side];
	const { rotationY, isNorthSouth, offsetSign } = layout;

	const wallOffsetValue = getWallOffsetValue(isNorthSouth, offsetSign);

	const wallOpening = side as RoomWallOpening;
	const hasDoor = hasOpening(wallOpening, doorConfig.wallOpenings);
	const renderCollider = shouldRenderCollider(
		wallOpening,
		doorConfig.wallOpenings,
		doorConfig.openedDoorSides,
	);
	const locked = isDoorLocked(wallOpening, doorConfig.lockedDoorSides);

	const colliderHalfArgs = getDoorColliderHalfArgs(isNorthSouth);
	const doorMeshArgs = getDoorMeshArgs(isNorthSouth);
	const wallBoxArgs = getWallBoxArgs(isNorthSouth);
	const colliderPosition = getDoorColliderPosition(isNorthSouth, wallOffsetValue);
	const doorwayPosition = getDoorwayPosition(isNorthSouth, wallOffsetValue);

	const getWallPosition = (tilePos: number) =>
		getWallTilePosition(isNorthSouth, tilePos, wallOffsetValue);

	const getWallMeshPos = (tilePos: number) =>
		getWallMeshPosition(isNorthSouth, tilePos, wallOffsetValue);

	const getTorchPos = (tilePos: number) =>
		getTorchPosition(isNorthSouth, tilePos, wallOffsetValue, offsetSign);

	return {
		rotationY,
		isNorthSouth,
		hasDoor,
		renderCollider,
		locked,
		colliderHalfArgs,
		doorMeshArgs,
		wallBoxArgs,
		colliderPosition,
		doorwayPosition,
		wallOffsetValue,
		doorwayScale: ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE,
		wallScale: ROOM_GLTF_CONFIG.WALL.SCALE,
		torchScale: ROOM_GLTF_CONFIG.TORCH.SCALE,
		getWallPosition,
		getWallMeshPos,
		getTorchPos,
	};
};

export type { UseRoomWallSegmentInput, UseRoomWallSegmentResult };
