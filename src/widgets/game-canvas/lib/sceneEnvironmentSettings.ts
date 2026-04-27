import type { CorridorMeshSettings } from "@/entities/corridor";
import {
	DOOR_SIDES,
	FLOOR_ONE_MACHINE_RULES,
	ROOM_IDS,
} from "@/entities/dungeon";
import type { PlayerMeshSettings } from "@/entities/player";
import type { DungeonFloorLayout, RoomWallOpening } from "@/entities/room";

import {
	createSceneCorridorMeshSettings,
	createSceneEnemyMeshSettings,
	createSceneRoomMeshSettings,
	createSceneSpawnPosition,
	type EnemyMeshSettings,
	type SceneRoomMeshSettings,
} from "./sceneEnvironmentMappers";

type CreateSceneEnvironmentSettingsViewModelInput = {
	defaultPlayerMeshSettings: PlayerMeshSettings;
	enemiesRemaining: number;
	floorLayout: DungeonFloorLayout;
	hasTreasureKey: boolean;
};

type SceneEnvironmentSettingsViewModel = {
	corridorMeshSettings: CorridorMeshSettings[];
	enemyMeshSettings: EnemyMeshSettings[];
	playerMeshSettings: PlayerMeshSettings;
	roomMeshSettings: SceneRoomMeshSettings[];
};

const resolveLockedDoorSidesByRoomId = (
	hasTreasureKey: boolean,
	enemiesRemaining: number,
): Partial<Record<string, readonly RoomWallOpening[]>> => {
	return {
		[ROOM_IDS.GUARD_ROOM]:
			hasTreasureKey &&
			enemiesRemaining === FLOOR_ONE_MACHINE_RULES.NO_ENEMIES_REMAINING
				? ([] as const)
				: ([DOOR_SIDES.SOUTH] as const),
		[ROOM_IDS.TREASURY]: hasTreasureKey
			? ([] as const)
			: ([DOOR_SIDES.SOUTH] as const),
	};
};

const applyRoomVisibilityFlags = (
	roomMeshSettings: SceneRoomMeshSettings[],
	hasTreasureKey: boolean,
): SceneRoomMeshSettings[] => {
	return roomMeshSettings.map((roomMeshSetting) => ({
		...roomMeshSetting,
		isTreasury: roomMeshSetting.roomId === ROOM_IDS.TREASURY,
		showTreasureKey:
			roomMeshSetting.roomId === ROOM_IDS.GUARD_ROOM && !hasTreasureKey,
	}));
};

export const createSceneEnvironmentSettingsViewModel = (
	input: CreateSceneEnvironmentSettingsViewModelInput,
): SceneEnvironmentSettingsViewModel => {
	const {
		defaultPlayerMeshSettings,
		enemiesRemaining,
		floorLayout,
		hasTreasureKey,
	} = input;
	const lockedDoorSidesByRoomId = resolveLockedDoorSidesByRoomId(
		hasTreasureKey,
		enemiesRemaining,
	);
	const corridorMeshSettings = createSceneCorridorMeshSettings(
		floorLayout.corridors,
	);
	const roomMeshSettings = applyRoomVisibilityFlags(
		createSceneRoomMeshSettings(
			floorLayout.rooms,
			floorLayout.corridors,
			lockedDoorSidesByRoomId,
		),
		hasTreasureKey,
	);
	const enemyMeshSettings = createSceneEnemyMeshSettings(
		floorLayout.rooms,
		ROOM_IDS.GUARD_ROOM,
		enemiesRemaining,
	);
	const playerPosition = createSceneSpawnPosition(
		floorLayout.rooms,
		defaultPlayerMeshSettings.position,
	);

	return {
		corridorMeshSettings,
		enemyMeshSettings,
		playerMeshSettings: {
			...defaultPlayerMeshSettings,
			position: playerPosition,
		},
		roomMeshSettings,
	};
};

export type {
	CreateSceneEnvironmentSettingsViewModelInput,
	SceneEnvironmentSettingsViewModel,
};
