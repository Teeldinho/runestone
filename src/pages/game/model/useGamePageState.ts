import { usePlayerMachineRuntime } from "@/entities/player";
import { useGameMachine } from "@/features/dungeon-navigation";

import { GAME_PAGE_COPY } from "../config";

export const useGamePageState = () => {
	const {
		activeStateLabel,
		actionButtons,
		currentRoomLabel,
		currentRoomId,
		discoveredRoomLabels,
		enemiesRemaining,
		hasTreasureKey,
	} = useGameMachine();
	const { snapshot: playerSnapshot } = usePlayerMachineRuntime();

	return {
		actionButtons,
		activeStateLabel,
		canvasMachineRuntime: {
			currentRoomId,
			enemiesRemaining,
			hasTreasureKey,
		},
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		hasTreasureKeyLabel: hasTreasureKey
			? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
			: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};
