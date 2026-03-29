import { useCallback, useSyncExternalStore } from "react";

import { DUNGEON_EVENTS } from "@/entities/dungeon";
import { PLAYER_EVENTS, usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";
import { ENEMY_CONFIG } from "@/shared/config";
import {
	getPlayerPositionSnapshot,
	subscribeToPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

type UseEnemySceneControllerResult = {
	playerPosition: Vector3Tuple;
	handleEnemyDead: () => void;
	handleEnemyAttack: () => void;
};

export const useEnemySceneController = (): UseEnemySceneControllerResult => {
	const { sendDungeonMachineEvent } = useGameMachineRuntime();
	const { sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const { onEnemyHit } = useHaptics();
	const playerPosition = useSyncExternalStore(
		subscribeToPlayerPosition,
		getPlayerPositionSnapshot,
		getPlayerPositionSnapshot,
	);

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
		playerPosition,
		handleEnemyDead,
		handleEnemyAttack,
	};
};
