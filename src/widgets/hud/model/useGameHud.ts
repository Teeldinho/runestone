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
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		hasTreasureKeyLabel,
	} = snapshot;

	return useMemo(() => {
		const machineSnapshotEntries = buildHudMachineSnapshotEntries({
			activeStateLabel,
			currentRoomLabel,
			enemiesRemaining,
			hasTreasureKeyLabel,
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
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
		playerHp,
		playerMaxHp,
	]);
};
