import { useCallback } from "react";

import { DUNGEON_EVENTS } from "@/entities/dungeon";
import { PLAYER_EVENTS, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { ENEMY_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/types";

type UseEnemySceneControllerResult = {
	playerPosition: Vector3Tuple;
	handleEnemyDead: () => void;
	handleEnemyAttack: () => void;
};

export const useEnemySceneController = (): UseEnemySceneControllerResult => {
	const { sendDungeonMachineEvent } = useGameMachineRuntime();
	const { snapshot, sendPlayerMachineEvent } = usePlayerMachineRuntime();

	const handleEnemyDead = useCallback(() => {
		sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENEMY_DIED });
	}, [sendDungeonMachineEvent]);

	const handleEnemyAttack = useCallback(() => {
		sendPlayerMachineEvent({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: ENEMY_CONFIG.ATTACK_DAMAGE,
		});
	}, [sendPlayerMachineEvent]);

	return {
		playerPosition: snapshot.context.position,
		handleEnemyDead,
		handleEnemyAttack,
	};
};
