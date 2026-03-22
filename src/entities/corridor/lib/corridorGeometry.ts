import { CORRIDOR_DIRECTION_ORDER, CORRIDOR_DIRECTIONS } from "../config";
import type {
	CorridorDirection,
	CorridorMeshSettings,
	CorridorMeshSettingsInput,
	CorridorPositionInput,
} from "../model";

const CORRIDOR_CENTER_DIVISOR = 2;
const CORRIDOR_QUARTER_TURN_RAD = Math.PI / 2;

export const getCorridorPosition = ({
	anchor,
	depth,
	direction,
	yOffset,
}: CorridorPositionInput): readonly [number, number, number] => {
	const corridorOffset = depth / CORRIDOR_CENTER_DIVISOR;

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
		return CORRIDOR_QUARTER_TURN_RAD;
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
