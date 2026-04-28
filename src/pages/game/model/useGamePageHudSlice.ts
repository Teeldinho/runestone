import { deriveTreasureKeyStatusLabel } from "../lib/deriveTreasureKeyStatusLabel";
import type { GamePageMachineState } from "./useGamePageMachineState";
import { useGamePageReset } from "./useGamePageReset";

type UseGamePageHudSliceInput = {
	gameMachine: Pick<
		GamePageMachineState["gameMachine"],
		"navigation" | "room" | "status"
	>;
	playerMachine: GamePageMachineState["playerMachine"];
};

export const useGamePageHudSlice = ({
	gameMachine,
	playerMachine,
}: UseGamePageHudSliceInput) => {
	const { navigation, room, status } = gameMachine;
	const { actionButtons, handleDungeonRunReset: resetDungeonMachine } =
		navigation;
	const { currentRoomLabel, discoveredRoomLabels } = room;
	const { enemiesRemaining, hasTreasureKey, nearInteractableLabel } = status;

	const { sendPlayerMachineEvent, snapshot: playerSnapshot } = playerMachine;

	const { handleDungeonRunReset } = useGamePageReset({
		resetDungeonMachine,
		sendPlayerMachineEvent,
	});

	return {
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel: deriveTreasureKeyStatusLabel(hasTreasureKey),
		nearInteractableLabel,
		playerHp: playerSnapshot.context.stats.hp,
		playerMaxHp: playerSnapshot.context.stats.maxHp,
	};
};

export type { UseGamePageHudSliceInput };
