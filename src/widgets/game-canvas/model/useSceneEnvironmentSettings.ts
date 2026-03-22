import { useMemo } from "react";

import {
	CORRIDOR_ENTITY_CONFIG,
	type CorridorMeshSettings,
} from "@/entities/corridor";
import {
	createFloorOneMachine,
	ROOM_LABELS,
	type RoomId,
} from "@/entities/dungeon";
import { type PlayerMeshSettings, usePlayerMesh } from "@/entities/player";
import {
	createDungeonFloorLayout,
	getRoomLabelPosition,
	ROOM_ENTITY_CONFIG,
	type RoomLabelSettings,
} from "@/entities/room";
import type { Vector3Tuple } from "@/shared/types";

type SceneRoomMeshSettings = {
	roomId: string;
	position: Vector3Tuple;
	labelSettings: RoomLabelSettings;
};

type SceneEnvironmentSettingsViewModel = {
	corridorMeshSettings: CorridorMeshSettings[];
	playerMeshSettings: PlayerMeshSettings;
	roomMeshSettings: SceneRoomMeshSettings[];
};

const addPositionY = (
	position: Vector3Tuple,
	yOffset: number,
): Vector3Tuple => {
	return [position[0], position[1] + yOffset, position[2]];
};

const toRoomLabelSettings = (
	roomId: string,
	position: Vector3Tuple,
): RoomLabelSettings => {
	return {
		isVisible: true,
		position: getRoomLabelPosition({
			center: position,
			heightOffset: ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET,
		}),
		text: ROOM_LABELS[roomId as RoomId] ?? roomId,
	};
};

export const useSceneEnvironmentSettings =
	(): SceneEnvironmentSettingsViewModel => {
		const defaultPlayerMeshSettings = usePlayerMesh();

		return useMemo(() => {
			const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
			const corridorMeshSettings = floorLayout.corridors.map((corridor) => ({
				id: corridor.id,
				position: addPositionY(
					corridor.position,
					CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
				),
				rotationYRad: corridor.rotationYRad,
			}));

			const roomMeshSettings = floorLayout.rooms.map((room) => ({
				roomId: room.roomId,
				position: room.position,
				labelSettings: toRoomLabelSettings(room.roomId, room.position),
			}));

			const initialRoom = floorLayout.rooms.find((room) => room.isInitial);
			const playerOrigin =
				initialRoom?.position ?? defaultPlayerMeshSettings.position;
			const playerMeshSettings: PlayerMeshSettings = {
				...defaultPlayerMeshSettings,
				position: [
					playerOrigin[0],
					defaultPlayerMeshSettings.position[1],
					playerOrigin[2],
				],
			};

			return {
				corridorMeshSettings,
				playerMeshSettings,
				roomMeshSettings,
			};
		}, [defaultPlayerMeshSettings]);
	};

export type { SceneEnvironmentSettingsViewModel, SceneRoomMeshSettings };
