import { useMemo } from "react";
import type { CorridorMeshSettings } from "@/entities/corridor";
import { createFloorOneMachine } from "@/entities/dungeon";
import { type PlayerMeshSettings, usePlayerMesh } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	createSceneCorridorMeshSettings,
	createSceneRoomMeshSettings,
	createSceneSpawnPosition,
	type SceneRoomMeshSettings,
} from "@/widgets/game-canvas/lib";

type SceneEnvironmentSettingsViewModel = {
	corridorMeshSettings: CorridorMeshSettings[];
	playerMeshSettings: PlayerMeshSettings;
	roomMeshSettings: SceneRoomMeshSettings[];
};

export const useSceneEnvironmentSettings =
	(): SceneEnvironmentSettingsViewModel => {
		const defaultPlayerMeshSettings = usePlayerMesh();

		return useMemo(() => {
			const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
			const corridorMeshSettings = createSceneCorridorMeshSettings(
				floorLayout.corridors,
			);
			const roomMeshSettings = createSceneRoomMeshSettings(floorLayout.rooms);
			const playerPosition = createSceneSpawnPosition(
				floorLayout.rooms,
				defaultPlayerMeshSettings.position,
			);

			const playerMeshSettings: PlayerMeshSettings = {
				...defaultPlayerMeshSettings,
				position: playerPosition,
			};

			return {
				corridorMeshSettings,
				playerMeshSettings,
				roomMeshSettings,
			};
		}, [defaultPlayerMeshSettings]);
	};

export type { SceneEnvironmentSettingsViewModel, SceneRoomMeshSettings };
