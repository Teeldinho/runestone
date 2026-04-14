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

	it("computes hpPercentage and isLowHp from playerHp and playerMaxHp", () => {
		const { result } = renderHook(() =>
			useGameHud({ ...BASE_PARAMS, playerHp: 80, playerMaxHp: 100 }),
		);

		expect(result.current.hpPercentage).toBe(80);
		expect(result.current.isLowHp).toBe(false);
	});

	it("marks hp as low when below 30 percent", () => {
		const { result } = renderHook(() =>
			useGameHud({ ...BASE_PARAMS, playerHp: 20, playerMaxHp: 100 }),
		);

		expect(result.current.hpPercentage).toBe(20);
		expect(result.current.isLowHp).toBe(true);
	});

	it("clamps hpPercentage to 0-100 range", () => {
		const { result: result1 } = renderHook(() =>
			useGameHud({ ...BASE_PARAMS, playerHp: -10, playerMaxHp: 100 }),
		);
		expect(result1.current.hpPercentage).toBe(0);

		const { result: result2 } = renderHook(() =>
			useGameHud({ ...BASE_PARAMS, playerHp: 150, playerMaxHp: 100 }),
		);
		expect(result2.current.hpPercentage).toBe(100);
	});
});
