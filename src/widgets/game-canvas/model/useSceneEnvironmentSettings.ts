import { shallowEqual } from "@xstate/react";
import { createFloorOneMachine } from "@/entities/dungeon";
import { usePlayerMesh } from "@/entities/player";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	selectDoorwayNavigationContext,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import {
	createSceneEnvironmentSettingsViewModel,
	type SceneEnvironmentSettingsViewModel,
} from "@/widgets/game-canvas/lib";

export const useSceneEnvironmentSettings =
	(): SceneEnvironmentSettingsViewModel => {
		const defaultPlayerMeshSettings = usePlayerMesh();
		const { enemiesRemaining, hasTreasureKey } = useGameMachineSelector(
			selectDoorwayNavigationContext,
			shallowEqual,
		);

		const floorLayout = createDungeonFloorLayout(createFloorOneMachine());

		return createSceneEnvironmentSettingsViewModel({
			defaultPlayerMeshSettings,
			enemiesRemaining,
			floorLayout,
			hasTreasureKey,
		});
	};

export type { SceneEnvironmentSettingsViewModel } from "@/widgets/game-canvas/lib";
