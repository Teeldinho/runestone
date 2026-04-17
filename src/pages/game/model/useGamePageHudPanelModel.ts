import type { GamePageViewModel } from "./useGamePage";
import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

type GamePageHudPanelModel = Pick<
	GamePageViewModel,
	| "actionButtons"
	| "activeStateLabel"
	| "currentRoomLabel"
	| "discoveredRoomLabels"
	| "enemiesRemaining"
	| "handleDungeonRunReset"
	| "hasTreasureKeyLabel"
	| "playerHp"
	| "playerMaxHp"
>;

export const useGamePageHudPanelModel = (): GamePageHudPanelModel => {
	const {
		actionButtons,
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
		playerHp,
		playerMaxHp,
	} = useGamePageViewModelContext();

	return {
		actionButtons,
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
		playerHp,
		playerMaxHp,
	};
};
