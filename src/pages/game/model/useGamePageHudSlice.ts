import { useMemo } from "react";

import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import type { GamePageMachineState } from "./useGamePageMachineState";
import { useGamePageReset } from "./useGamePageReset";

type UseGamePageHudSliceInput = {
	gameMachine: Pick<
		GamePageMachineState["gameMachine"],
		| "actionButtons"
		| "activeStateLabel"
		| "currentRoomLabel"
		| "discoveredRoomLabels"
		| "enemiesRemaining"
		| "handleDungeonRunReset"
		| "hasTreasureKey"
	>;
	playerMachine: GamePageMachineState["playerMachine"];
};

export const useGamePageHudSlice = ({
	gameMachine,
	playerMachine,
}: UseGamePageHudSliceInput) => {
	const {
		actionButtons,
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
	} = gameMachine;

	const { sendPlayerMachineEvent, snapshot: playerSnapshot } = playerMachine;

	const { handleDungeonRunReset } = useGamePageReset({
		resetDungeonMachine,
		sendPlayerMachineEvent,
	});

	return useMemo(
		() => ({
			actionButtons,
			activeStateLabel,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
			playerHp: playerSnapshot.context.stats.hp,
			playerMaxHp: playerSnapshot.context.stats.maxHp,
		}),
		[
			actionButtons,
			activeStateLabel,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKey,
			playerSnapshot.context.stats.hp,
			playerSnapshot.context.stats.maxHp,
		],
	);
};

export type { UseGamePageHudSliceInput };
