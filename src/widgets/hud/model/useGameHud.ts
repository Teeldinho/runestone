import { useMemo } from "react";

import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "../config";

import type { GameHudViewModel, HudActionButton } from "./types";

type UseGameHudParams = {
	actionButtons: HudActionButton[];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
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
