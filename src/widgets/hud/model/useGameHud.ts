import { useMemo } from "react";

import { DUNGEON_EVENTS } from "@/entities/dungeon";

import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "../config";

import type { GameHudViewModel, HudActionButton } from "./types";

const SIDEBAR_EXCLUDED_EVENTS = new Set<string>([
	DUNGEON_EVENTS.PICK_UP_KEY,
	DUNGEON_EVENTS.ENEMY_DIED,
]);

type UseGameHudParams = {
	actionButtons: HudActionButton[];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
	playerHp: number;
	playerMaxHp: number;
};

export const useGameHud = ({
	actionButtons,
	activeStateLabel,
	currentRoomLabel,
	discoveredRoomLabels,
	enemiesRemaining,
	handleDungeonRunReset,
	hasTreasureKeyLabel,
	playerHp,
	playerMaxHp,
}: UseGameHudParams): GameHudViewModel => {
	return useMemo(
		() => ({
			actionButtons: actionButtons.filter(
				(button) => !SIDEBAR_EXCLUDED_EVENTS.has(button.eventType),
			),
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
				{
					displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
					label: HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
					value: `${playerHp} / ${playerMaxHp}`,
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
			playerHp,
			playerMaxHp,
		],
	);
};
