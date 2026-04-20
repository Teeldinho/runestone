import { useMemo } from "react";

import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import type { GamePageMachineState } from "./useGamePageMachineState";
import { useGamePageReset } from "./useGamePageReset";

type UseGamePageHudSliceInput = {
	gameMachine: Pick<
		GamePageMachineState["gameMachine"],
		| "actionButtons"
		| "currentRoomLabel"
		| "discoveredRoomLabels"
		| "enemiesRemaining"
		| "handleDungeonRunReset"
		| "hasTreasureKey"
		| "nearInteractableLabel"
	>;
	playerMachine: GamePageMachineState["playerMachine"];
};

export const useGamePageHudSlice = ({
	gameMachine,
	playerMachine,
}: UseGamePageHudSliceInput) => {
	const {
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset: resetDungeonMachine,
		hasTreasureKey,
		nearInteractableLabel,
	} = gameMachine;

	const { sendPlayerMachineEvent, snapshot: playerSnapshot } = playerMachine;

	const { handleDungeonRunReset } = useGamePageReset({
		resetDungeonMachine,
		sendPlayerMachineEvent,
	});

	return useMemo(
		() => ({
			actionButtons,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
			nearInteractableLabel,
			playerHp: playerSnapshot.context.stats.hp,
			playerMaxHp: playerSnapshot.context.stats.maxHp,
		}),
		[
			actionButtons,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKey,
			nearInteractableLabel,
			playerSnapshot.context.stats.hp,
			playerSnapshot.context.stats.maxHp,
		],
	);
};

export type { UseGamePageHudSliceInput };
