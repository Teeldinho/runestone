import { useMemo } from "react";
import type { CorridorMeshSettings } from "@/entities/corridor";
import {
	createFloorOneMachine,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { type PlayerMeshSettings, usePlayerMesh } from "@/entities/player";
import {
	createDungeonFloorLayout,
	type RoomWallOpening,
} from "@/entities/room";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
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

const getOpenedDoorSidesForRoom = (
	roomId: string,
	wallOpenings: RoomWallOpening[],
	openedDoors: string[],
): RoomWallOpening[] => {
	return wallOpenings.filter((side) => {
		const doorKey = `${roomId}:${side}` as const;
		return openedDoors.includes(doorKey);
	});
};

export const useSceneEnvironmentSettings =
	(): SceneEnvironmentSettingsViewModel => {
		const defaultPlayerMeshSettings = usePlayerMesh();
		const { snapshot } = useGameMachineRuntime();

		return useMemo(() => {
			const openedDoors = snapshot.context.openedDoors ?? [];
			const floorLayout = createDungeonFloorLayout(createFloorOneMachine());
			const lockedDoorSidesByRoomId = {
				[ROOM_IDS.GUARD_ROOM]:
					snapshot.context.hasTreasureKey &&
					snapshot.context.enemiesRemaining ===
						FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
						? ([] as const)
						: (["south"] as const),
				[ROOM_IDS.TREASURY]: snapshot.context.hasTreasureKey
					? ([] as const)
					: (["south"] as const),
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
				openedDoorSides: getOpenedDoorSidesForRoom(
					roomMeshSetting.roomId,
					roomMeshSetting.wallOpenings,
					openedDoors,
				),
				isTreasury: roomMeshSetting.roomId === ROOM_IDS.TREASURY,
				showTreasureKey:
					roomMeshSetting.roomId === ROOM_IDS.GUARD_ROOM &&
					!snapshot.context.hasTreasureKey,
			}));
			const enemyMeshSettings = createSceneEnemyMeshSettings(
				floorLayout.rooms,
				ROOM_IDS.GUARD_ROOM,
				snapshot.context.enemiesRemaining,
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
		}, [
			defaultPlayerMeshSettings,
			snapshot.context.enemiesRemaining,
			snapshot.context.hasTreasureKey,
			snapshot.context.openedDoors,
		]);
	};

export type { SceneEnvironmentSettingsViewModel, SceneRoomMeshSettings };
