// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HUD_COPY } from "@/widgets/hud/config";

import { useGameHud } from "./useGameHud";

describe("useGameHud", () => {
	it("builds machine snapshot entries and forwards action handlers", () => {
		const handleActionTrigger = vi.fn();
		const handleDungeonRunReset = vi.fn();

		const { result } = renderHook(() =>
			useGameHud({
				actionButtons: [
					{
						eventType: "ENTER_LIBRARY",
						label: "Enter Library",
						isDisabled: false,
						handleDungeonActionTrigger: handleActionTrigger,
					},
				],
				activeStateLabel: "entrance",
				currentRoomLabel: "Entrance",
				discoveredRoomLabels: ["Entrance", "Library"],
				enemiesRemaining: 1,
				hasTreasureKeyLabel: "Missing",
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
});
