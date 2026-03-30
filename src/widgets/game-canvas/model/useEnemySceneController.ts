import { useCallback } from "react";

import { DUNGEON_EVENTS } from "@/entities/dungeon";
import { PLAYER_EVENTS, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";
import { ENEMY_CONFIG } from "@/shared/config";

type UseEnemySceneControllerResult = {
	handleEnemyDead: () => void;
	handleEnemyAttack: () => void;
};

export const useEnemySceneController = (): UseEnemySceneControllerResult => {
	const { sendDungeonMachineEvent } = useGameMachineRuntime();
	const { sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const { onEnemyHit } = useHaptics();

	const handleEnemyDead = useCallback(() => {
		sendDungeonMachineEvent({ type: DUNGEON_EVENTS.ENEMY_DIED });
	}, [sendDungeonMachineEvent]);

	const handleEnemyAttack = useCallback(() => {
		onEnemyHit();
		sendPlayerMachineEvent({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: ENEMY_CONFIG.ATTACK_DAMAGE,
		});
	}, [sendPlayerMachineEvent, onEnemyHit]);

	return {
		handleEnemyDead,
		handleEnemyAttack,
	};
};
