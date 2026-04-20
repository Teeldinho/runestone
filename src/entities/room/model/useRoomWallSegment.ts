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

type WallLayout = {
	rotationY: number;
	isNorthSouth: boolean;
	wallOffsetValue: number;
};

type DoorState = {
	hasDoor: boolean;
	renderCollider: boolean;
	locked: boolean;
};

type DoorGeometry = {
	colliderHalfArgs: [number, number, number];
	doorMeshArgs: [number, number, number];
	colliderPosition: [number, number, number];
	doorwayPosition: [number, number, number];
	doorwayScale: readonly [number, number, number];
};

type WallGeometry = {
	wallBoxArgs: [number, number, number];
	wallScale: readonly [number, number, number];
	getWallPosition: (tilePos: number) => [number, number, number];
	getWallMeshPos: (tilePos: number) => [number, number, number];
};

type TorchGeometry = {
	torchScale: readonly [number, number, number];
	getTorchPos: (tilePos: number) => [number, number, number];
};

type UseRoomWallSegmentResult = {
	layout: WallLayout;
	door: DoorState;
	doorGeometry: DoorGeometry;
	wallGeometry: WallGeometry;
	torchGeometry: TorchGeometry;
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
	const colliderPosition = getDoorColliderPosition(
		isNorthSouth,
		wallOffsetValue,
	);
	const doorwayPosition = getDoorwayPosition(isNorthSouth, wallOffsetValue);

	const getWallPosition = (tilePos: number) =>
		getWallTilePosition(isNorthSouth, tilePos, wallOffsetValue);

	const getWallMeshPos = (tilePos: number) =>
		getWallMeshPosition(isNorthSouth, tilePos, wallOffsetValue);

	const getTorchPos = (tilePos: number) =>
		getTorchPosition(isNorthSouth, tilePos, wallOffsetValue, offsetSign);

	return {
		layout: {
			rotationY,
			isNorthSouth,
			wallOffsetValue,
		},
		door: {
			hasDoor,
			renderCollider,
			locked,
		},
		doorGeometry: {
			colliderHalfArgs,
			doorMeshArgs,
			colliderPosition,
			doorwayPosition,
			doorwayScale: ROOM_GLTF_CONFIG.WALL_DOORWAY.SCALE,
		},
		wallGeometry: {
			wallBoxArgs,
			wallScale: ROOM_GLTF_CONFIG.WALL.SCALE,
			getWallPosition,
			getWallMeshPos,
		},
		torchGeometry: {
			torchScale: ROOM_GLTF_CONFIG.TORCH.SCALE,
			getTorchPos,
		},
	};
};

export type {
	DoorGeometry,
	DoorState,
	TorchGeometry,
	UseRoomWallSegmentInput,
	UseRoomWallSegmentResult,
	WallGeometry,
	WallLayout,
};
