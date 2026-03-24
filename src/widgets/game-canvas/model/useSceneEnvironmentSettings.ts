import { useMemo } from "react";
import type { CorridorMeshSettings } from "@/entities/corridor";
import { createFloorOneMachine, ROOM_IDS } from "@/entities/dungeon";
import { type PlayerMeshSettings, usePlayerMesh } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	createSceneCorridorMeshSettings,
	createSceneEnemyMeshSettings,
	createSceneRoomMeshSettings,
	createSceneSpawnPosition,
	type EnemyMeshSettings,
	type SceneRoomMeshSettings,
} from "@/widgets/game-canvas/lib";

type SceneEnvironmentSettingsViewModel = {
	corridorMeshSettings: CorridorMeshSettings[];
	enemyMeshSettings: EnemyMeshSettings[];
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
			const roomMeshSettings = createSceneRoomMeshSettings(
				floorLayout.rooms,
				floorLayout.corridors,
			);
			const enemyMeshSettings = createSceneEnemyMeshSettings(
				floorLayout.rooms,
				ROOM_IDS.GUARD_ROOM,
			);
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
				enemyMeshSettings,
				playerMeshSettings,
				roomMeshSettings,
			};
		}, [defaultPlayerMeshSettings]);
	};

export type { SceneEnvironmentSettingsViewModel, SceneRoomMeshSettings };
