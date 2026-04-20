import { ROOM_CONFIG } from "@/shared/config";

import {
	ROOM_ENTITY_CONFIG,
	ROOM_GEOMETRY,
	ROOM_LIGHT_CONFIG,
} from "../config";

type AxisTuple = [number, number, number];

export const getWallOffsetValue = (
	isNorthSouth: boolean,
	offsetSign: number,
): number =>
	isNorthSouth
		? offsetSign * ROOM_GEOMETRY.HALF_DEPTH
		: offsetSign * ROOM_GEOMETRY.HALF_WIDTH;

const DOOR_GATE = ROOM_ENTITY_CONFIG.DOORWAY_GATE;

export const getDoorColliderHalfArgs = (isNorthSouth: boolean): AxisTuple =>
	isNorthSouth
		? [DOOR_GATE.WIDTH / 2, DOOR_GATE.HEIGHT / 2, DOOR_GATE.THICKNESS / 2]
		: [DOOR_GATE.THICKNESS / 2, DOOR_GATE.HEIGHT / 2, DOOR_GATE.WIDTH / 2];

export const getDoorMeshArgs = (isNorthSouth: boolean): AxisTuple =>
	isNorthSouth
		? [DOOR_GATE.WIDTH, DOOR_GATE.HEIGHT, DOOR_GATE.THICKNESS]
		: [DOOR_GATE.THICKNESS, DOOR_GATE.HEIGHT, DOOR_GATE.WIDTH];

export const getWallBoxArgs = (isNorthSouth: boolean): AxisTuple =>
	isNorthSouth
		? [
				ROOM_GEOMETRY.WALL_TILE_WIDTH,
				ROOM_CONFIG.HEIGHT,
				ROOM_CONFIG.WALL_THICKNESS,
			]
		: [
				ROOM_CONFIG.WALL_THICKNESS,
				ROOM_CONFIG.HEIGHT,
				ROOM_GEOMETRY.WALL_TILE_WIDTH,
			];

export const getDoorColliderPosition = (
	isNorthSouth: boolean,
	wallOffsetValue: number,
): AxisTuple =>
	isNorthSouth
		? [0, DOOR_GATE.POSITION_Y, wallOffsetValue]
		: [wallOffsetValue, DOOR_GATE.POSITION_Y, 0];

export const getDoorwayPosition = (
	isNorthSouth: boolean,
	wallOffsetValue: number,
): AxisTuple =>
	isNorthSouth
		? [0, ROOM_GEOMETRY.WALL_Y, wallOffsetValue]
		: [wallOffsetValue, ROOM_GEOMETRY.WALL_Y, 0];

export const getWallTilePosition = (
	isNorthSouth: boolean,
	tilePos: number,
	wallOffsetValue: number,
): AxisTuple =>
	isNorthSouth
		? [tilePos, ROOM_GEOMETRY.WALL_Y, wallOffsetValue]
		: [wallOffsetValue, ROOM_GEOMETRY.WALL_Y, tilePos];

export const getWallMeshPosition = (
	isNorthSouth: boolean,
	tilePos: number,
	wallOffsetValue: number,
): AxisTuple =>
	isNorthSouth ? [tilePos, 0, wallOffsetValue] : [wallOffsetValue, 0, tilePos];

export const getTorchPosition = (
	isNorthSouth: boolean,
	tilePos: number,
	wallOffsetValue: number,
	offsetSign: number,
): AxisTuple => {
	const insetDir = -offsetSign;
	const inset = insetDir * ROOM_GEOMETRY.TORCH_INSET;

	return isNorthSouth
		? [tilePos, ROOM_LIGHT_CONFIG.HEIGHT, wallOffsetValue + inset]
		: [wallOffsetValue + inset, ROOM_LIGHT_CONFIG.HEIGHT, tilePos];
};

export const getKeyRingPosition = (shaftLength: number): AxisTuple => [
	-shaftLength / 2,
	0,
	0,
];

export const getKeyToothPosition = (
	shaftLength: number,
	toothHeight: number,
): AxisTuple => [shaftLength / 2, -toothHeight / 2, 0];
