import { useMemo } from "react";

import { HUD_COPY } from "@/widgets/hud/config";

type HudActionButton = {
	eventType: string;
	handleDungeonActionTrigger: () => void;
	isDisabled: boolean;
	label: string;
};

type UseGameHudParams = {
	actionButtons: HudActionButton[];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
};

type HudMachineSnapshotEntry = {
	label: string;
	value: string;
};

type GameHudViewModel = {
	actionButtons: HudActionButton[];
	discoveredRoomLabels: string[];
	handleDungeonRunReset: () => void;
	machineSnapshotEntries: HudMachineSnapshotEntry[];
};

export const useGameHud = ({
	actionButtons,
	activeStateLabel,
	currentRoomLabel,
	discoveredRoomLabels,
	enemiesRemaining,
	handleDungeonRunReset,
	hasTreasureKeyLabel,
}: UseGameHudParams): GameHudViewModel => {
	return useMemo(
		() => ({
			actionButtons,
			discoveredRoomLabels,
			handleDungeonRunReset,
			machineSnapshotEntries: [
				{
					label: HUD_COPY.SNAPSHOT_LABELS.CURRENT_ROOM,
					value: currentRoomLabel,
				},
				{
					label: HUD_COPY.SNAPSHOT_LABELS.ROOM_STATE,
					value: activeStateLabel,
				},
				{
					label: HUD_COPY.SNAPSHOT_LABELS.TREASURE_KEY,
					value: hasTreasureKeyLabel,
				},
				{
					label: HUD_COPY.SNAPSHOT_LABELS.ENEMIES_REMAINING,
					value: String(enemiesRemaining),
				},
			],
		}),
		[
			actionButtons,
			activeStateLabel,
			currentRoomLabel,
			discoveredRoomLabels,
			enemiesRemaining,
			handleDungeonRunReset,
			hasTreasureKeyLabel,
		],
	);
};

export type { GameHudViewModel, HudActionButton, HudMachineSnapshotEntry };
