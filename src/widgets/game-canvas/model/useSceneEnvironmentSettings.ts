import { shallowEqual } from "@xstate/react";
import { useMemo } from "react";
import type { CorridorMeshSettings } from "@/entities/corridor";
import {
	createFloorOneMachine,
	DOOR_SIDES,
	type DoorSide,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { type PlayerMeshSettings, usePlayerMesh } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	selectDoorwayNavigationContext,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
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
		const { enemiesRemaining, hasTreasureKey } = useGameMachineSelector(
			selectDoorwayNavigationContext,
			shallowEqual,
		);

		return useMemo(() => {
			const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
			const lockedDoorSidesByRoomId: Partial<Record<string, DoorSide[]>> = {
				[ROOM_IDS.GUARD_ROOM]:
					hasTreasureKey &&
					enemiesRemaining === FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
						? []
						: [DOOR_SIDES.SOUTH],
				[ROOM_IDS.TREASURY]: hasTreasureKey ? [] : [DOOR_SIDES.SOUTH],
			};
			const corridorMeshSettings = createSceneCorridorMeshSettings(
				floorLayout.corridors,
			);
			const roomMeshSettings = createSceneRoomMeshSettings(
				floorLayout.rooms,
				floorLayout.corridors,
				lockedDoorSidesByRoomId,
			).map((roomMeshSetting) => ({
				...roomMeshSetting,
				isTreasury: roomMeshSetting.roomId === ROOM_IDS.TREASURY,
				showTreasureKey:
					roomMeshSetting.roomId === ROOM_IDS.GUARD_ROOM && !hasTreasureKey,
			}));
			const enemyMeshSettings = createSceneEnemyMeshSettings(
				floorLayout.rooms,
				ROOM_IDS.GUARD_ROOM,
				enemiesRemaining,
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
		}, [defaultPlayerMeshSettings, enemiesRemaining, hasTreasureKey]);
	};

export type { SceneEnvironmentSettingsViewModel, SceneRoomMeshSettings };
