import type { Vector3Tuple } from "@/shared/lib";
import type { CORRIDOR_DIRECTIONS } from "../config";

export type CorridorDirection =
	(typeof CORRIDOR_DIRECTIONS)[keyof typeof CORRIDOR_DIRECTIONS];

export type CorridorAnchorMap = Record<CorridorDirection, Vector3Tuple>;

export type CorridorMeshSettings = {
	id: string;
	position: Vector3Tuple;
	rotationYRad: number;
};

export type CorridorPositionInput = {
	anchor: Vector3Tuple;
	depth: number;
	direction: CorridorDirection;
	yOffset: number;
};

export type CorridorMeshSettingsInput = {
	anchors: CorridorAnchorMap;
	depth: number;
	yOffset: number;
};
