import type { Vector3Tuple } from "@/shared/lib";
import type { ROOM_DOOR_GUARDS, ROOM_KINDS, RoomWallSide } from "../config";

export type RoomKind = (typeof ROOM_KINDS)[keyof typeof ROOM_KINDS];

export type RoomDoorGuard =
	(typeof ROOM_DOOR_GUARDS)[keyof typeof ROOM_DOOR_GUARDS];

export type RoomWallOpening = RoomWallSide;

export type RoomDoorConfig = {
	wallOpenings: RoomWallOpening[];
	lockedDoorSides: RoomWallOpening[];
	openedDoorSides: RoomWallOpening[];
};

export type RoomTreasuryConfig = {
	isTreasury: boolean;
	showTreasureKey: boolean;
};

export type RoomNode = {
	id: string;
	name: string;
	kind: RoomKind;
	worldPosition: Vector3Tuple;
	doorGuard: RoomDoorGuard;
};

export type RoomSurfaceSettings = {
	floor: {
		color: string;
		metalness: number;
		offsetY: number;
		roughness: number;
		rotationXRad: number;
		size: [number, number];
	};
	grid: {
		divisions: number;
		offsetY: number;
		size: number;
	};
	pillar: {
		color: string;
		height: number;
		metalness: number;
		positionY: number;
		radius: number;
		radialSegments: number;
		roughness: number;
	};
	rune: {
		activeColor: string;
		emissiveIntensity: number;
		openColor: string;
		orbHeight: number;
		orbHeightSegments: number;
		orbRadius: number;
		orbWidthSegments: number;
		sealedColor: string;
	};
	wall: {
		color: string;
		roughness: number;
		metalness: number;
	};
};

export type RoomTorchSettings = {
	color: string;
	decay: number;
	distance: number;
	intensity: number;
	position: Vector3Tuple;
};

export type RoomLabelSettings = {
	isVisible: boolean;
	position: Vector3Tuple;
	text: string;
};
