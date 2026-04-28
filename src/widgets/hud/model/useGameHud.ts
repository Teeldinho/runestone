import { useMemo } from "react";

import {
	buildHudHealthViewModel,
	buildHudMachineSnapshotEntries,
	filterHudActionButtons,
	getSidebarSnapshotEntries,
} from "../lib";

import type { GameHudInput, GameHudViewModel } from "./types";

export const useGameHud = ({
	actions,
	playerStats,
	snapshot,
}: GameHudInput): GameHudViewModel => {
	const { actionButtons, handleDungeonRunReset } = actions;
	const { playerHp, playerMaxHp } = playerStats;
	const {
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		hasTreasureKeyLabel,
		nearInteractableLabel,
	} = snapshot;

	return useMemo(() => {
		const machineSnapshotEntries = buildHudMachineSnapshotEntries({
			currentRoomLabel,
			enemiesRemaining,
			hasTreasureKeyLabel,
			nearInteractableLabel,
			playerHp,
			playerMaxHp,
		});

		return {
			actionButtons: filterHudActionButtons(actionButtons),
			discoveredRoomLabels,
			healthBar: buildHudHealthViewModel({ playerHp, playerMaxHp }),
			handleDungeonRunReset,
			machineSnapshotEntries,
			sidebarSnapshotEntries: getSidebarSnapshotEntries(machineSnapshotEntries),
		};
	}, [
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
		nearInteractableLabel,
		playerHp,
		playerMaxHp,
	]);
};
