import { useMemo } from "react";

import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "../config";

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
	displayVariant: HudDisplayVariant;
	label: string;
	value: string;
};

type HudDisplayVariant =
	(typeof HUD_DISPLAY_VARIANTS)[keyof typeof HUD_DISPLAY_VARIANTS];

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
					displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
					label: HUD_COPY.SNAPSHOT_LABELS.CURRENT_ROOM,
					value: currentRoomLabel,
				},
				{
					displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
					label: HUD_COPY.SNAPSHOT_LABELS.ROOM_STATE,
					value: activeStateLabel,
				},
				{
					displayVariant: HUD_DISPLAY_VARIANTS.BADGE,
					label: HUD_COPY.SNAPSHOT_LABELS.TREASURE_KEY,
					value: hasTreasureKeyLabel,
				},
				{
					displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
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

export type {
	GameHudViewModel,
	HudActionButton,
	HudDisplayVariant,
	HudMachineSnapshotEntry,
};
