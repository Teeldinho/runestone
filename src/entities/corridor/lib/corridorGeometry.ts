import type { Vector3Tuple } from "@/shared/types";

import {
	CORRIDOR_DIRECTION_ORDER,
	CORRIDOR_DIRECTIONS,
	CORRIDOR_ENTITY_CONFIG,
} from "../config";
import type {
	CorridorDirection,
	CorridorMeshSettings,
	CorridorMeshSettingsInput,
	CorridorPositionInput,
} from "../model";

export const getCorridorPosition = ({
	anchor,
	depth,
	direction,
	yOffset,
}: CorridorPositionInput): readonly [number, number, number] => {
	const corridorOffset =
		depth / CORRIDOR_ENTITY_CONFIG.GEOMETRY.CENTER_OFFSET_DIVISOR;

	if (direction === CORRIDOR_DIRECTIONS.EAST) {
		return [anchor[0] + corridorOffset, anchor[1] + yOffset, anchor[2]];
	}

	if (direction === CORRIDOR_DIRECTIONS.WEST) {
		return [anchor[0] - corridorOffset, anchor[1] + yOffset, anchor[2]];
	}

	if (direction === CORRIDOR_DIRECTIONS.NORTH) {
		return [anchor[0], anchor[1] + yOffset, anchor[2] - corridorOffset];
	}

	return [anchor[0], anchor[1] + yOffset, anchor[2] + corridorOffset];
};

export const getCorridorRotationY = (direction: CorridorDirection): number => {
	if (
		direction === CORRIDOR_DIRECTIONS.EAST ||
		direction === CORRIDOR_DIRECTIONS.WEST
	) {
		return CORRIDOR_ENTITY_CONFIG.GEOMETRY.HORIZONTAL_ROTATION_Y_RAD;
	}

	return 0;
};

export const createCorridorMeshSettings = ({
	anchors,
	depth,
	yOffset,
}: CorridorMeshSettingsInput): CorridorMeshSettings[] => {
	return CORRIDOR_DIRECTION_ORDER.map((direction) => {
		return {
			id: direction,
			position: getCorridorPosition({
				anchor: anchors[direction],
				depth,
				direction,
				yOffset,
			}),
			rotationYRad: getCorridorRotationY(direction),
		};
	});
};

export const getCorridorFloorTilePositions = (
	width: number,
	depth: number,
	tileSize: number,
): Vector3Tuple[] => {
	const positions: Vector3Tuple[] = [];
	const halfTile = tileSize / 2;

	for (let x = -width / 2 + halfTile; x < width / 2; x += tileSize) {
		for (let z = -depth / 2 + halfTile; z < depth / 2; z += tileSize) {
			positions.push([x, 0, z]);
		}
	}

	return positions;
};
