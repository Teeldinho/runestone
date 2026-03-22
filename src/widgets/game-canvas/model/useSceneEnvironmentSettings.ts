import { useMemo } from "react";

import {
	CORRIDOR_ENTITY_CONFIG,
	type CorridorMeshSettings,
	createCorridorMeshSettings,
} from "@/entities/corridor";
import {
	getRoomCorridorAnchors,
	getRoomLabelPosition,
	ROOM_ENTITY_CONFIG,
	type RoomLabelSettings,
} from "@/entities/room";
import type { Vector3Tuple } from "@/shared/types";

type SceneEnvironmentSettingsViewModel = {
	corridorMeshSettings: CorridorMeshSettings[];
	roomLabelSettings: RoomLabelSettings;
	roomPosition: Vector3Tuple;
};

export const useSceneEnvironmentSettings =
	(): SceneEnvironmentSettingsViewModel => {
		return useMemo(() => {
			const roomLabelSettings: RoomLabelSettings = {
				isVisible: true,
				position: getRoomLabelPosition({
					center: ROOM_ENTITY_CONFIG.ORIGIN,
					heightOffset: ROOM_ENTITY_CONFIG.LABEL.HEIGHT_OFFSET,
				}),
				text: ROOM_ENTITY_CONFIG.LABEL.TEXT,
			};

			const roomCorridorAnchors = getRoomCorridorAnchors({
				center: ROOM_ENTITY_CONFIG.ORIGIN,
				dimensions: ROOM_ENTITY_CONFIG.DIMENSIONS,
			});

			const corridorMeshSettings = createCorridorMeshSettings({
				anchors: roomCorridorAnchors,
				depth: CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
				yOffset: CORRIDOR_ENTITY_CONFIG.SURFACE.Y_OFFSET,
			});

			return {
				corridorMeshSettings,
				roomLabelSettings,
				roomPosition: ROOM_ENTITY_CONFIG.ORIGIN,
			};
		}, []);
	};

export type { SceneEnvironmentSettingsViewModel };
