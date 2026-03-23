import { useCallback } from "react";

import { DUNGEON_EVENTS } from "@/entities/dungeon";
import { usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/types";

type UseEnemySceneControllerResult = {
	playerPosition: Vector3Tuple;
	handleEnemyDead: () => void;
};

export const useEnemySceneController =
	(): UseEnemySceneControllerResult => {
		const { sendDungeonMachineEvent } = useGameMachineRuntime();
		const { snapshot } = usePlayerMachineRuntime();

		const handleEnemyDead = useCallback(() => {
			sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENEMY_DIED });
		}, [sendDungeonMachineEvent]);

		return {
			playerPosition: snapshot.context.position,
			handleEnemyDead,
		};
	};
