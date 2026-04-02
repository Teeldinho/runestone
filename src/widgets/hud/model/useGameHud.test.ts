// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HUD_COPY } from "@/widgets/hud/config";

import { useGameHud } from "./useGameHud";

const BASE_PARAMS = {
	actionButtons: [
		{
			eventType: "ENTER_LIBRARY",
			label: "Enter Library",
			isDisabled: false,
			handleDungeonActionTrigger: vi.fn(),
		},
	],
	activeStateLabel: "entrance",
	currentRoomLabel: "Entrance",
	discoveredRoomLabels: ["Entrance", "Library"],
	enemiesRemaining: 1,
	hasTreasureKeyLabel: "Missing",
	handleDungeonRunReset: vi.fn(),
	playerHp: 80,
	playerMaxHp: 100,
};

describe("useGameHud", () => {
	it("builds machine snapshot entries and forwards action handlers", () => {
		const handleActionTrigger = vi.fn();
		const handleDungeonRunReset = vi.fn();

		const { result } = renderHook(() =>
			useGameHud({
				...BASE_PARAMS,
				actionButtons: [
					{
						eventType: "ENTER_LIBRARY",
						label: "Enter Library",
						isDisabled: false,
						handleDungeonActionTrigger: handleActionTrigger,
					},
				],
				handleDungeonRunReset,
			}),
		);

		expect(result.current.machineSnapshotEntries).toEqual([
			{
				displayVariant: "text",
				label: HUD_COPY.SNAPSHOT_LABELS.CURRENT_ROOM,
				value: "Entrance",
			},
			{
				displayVariant: "text",
				label: HUD_COPY.SNAPSHOT_LABELS.ROOM_STATE,
				value: "entrance",
			},
			{
				displayVariant: "badge",
				label: HUD_COPY.SNAPSHOT_LABELS.TREASURE_KEY,
				value: "Missing",
			},
			{
				displayVariant: "text",
				label: HUD_COPY.SNAPSHOT_LABELS.ENEMIES_REMAINING,
				value: "1",
			},
			{
				displayVariant: "text",
				label: HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
				value: "80 / 100",
			},
		]);
		expect(result.current.actionButtons).toHaveLength(1);
		expect(result.current.actionButtons[0]?.handleDungeonActionTrigger).toBe(
			handleActionTrigger,
		);
		expect(result.current.handleDungeonRunReset).toBe(handleDungeonRunReset);
		expect(result.current.discoveredRoomLabels).toEqual([
			"Entrance",
			"Library",
		]);
	});

	it("formats hp display as 'current / max'", () => {
		const { result } = renderHook(() =>
			useGameHud({ ...BASE_PARAMS, playerHp: 45, playerMaxHp: 100 }),
		);

		const hpEntry = result.current.machineSnapshotEntries.find(
			(e) => e.label === HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
		);
		expect(hpEntry?.value).toBe("45 / 100");
	});
});
