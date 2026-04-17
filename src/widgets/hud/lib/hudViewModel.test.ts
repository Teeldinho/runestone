import { describe, expect, it } from "vitest";
import { DUNGEON_EVENTS } from "@/entities/dungeon";
import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "@/widgets/hud/config";

import {
	buildHudHealthViewModel,
	buildHudMachineSnapshotEntries,
	filterHudActionButtons,
	getSidebarSnapshotEntries,
} from "./hudViewModel";

describe("hudViewModel", () => {
	it("filters sidebar action buttons for excluded dungeon events", () => {
		const filteredButtons = filterHudActionButtons([
			{
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				handleDungeonActionTrigger: () => {},
				isDisabled: false,
				label: "Enter Library",
			},
			{
				eventType: DUNGEON_EVENTS.PICK_UP_KEY,
				handleDungeonActionTrigger: () => {},
				isDisabled: false,
				label: "Pick up key",
			},
			{
				eventType: DUNGEON_EVENTS.ENEMY_DIED,
				handleDungeonActionTrigger: () => {},
				isDisabled: false,
				label: "Enemy defeated",
			},
		]);

		expect(filteredButtons).toEqual([
			{
				eventType: DUNGEON_EVENTS.ENTER_LIBRARY,
				handleDungeonActionTrigger: expect.any(Function),
				isDisabled: false,
				label: "Enter Library",
			},
		]);
	});

	it("builds snapshot entries and excludes player hp from sidebar entries", () => {
		const entries = buildHudMachineSnapshotEntries({
			activeStateLabel: "entrance",
			currentRoomLabel: "Entrance",
			enemiesRemaining: 1,
			hasTreasureKeyLabel: "Missing",
			playerHp: 80,
			playerMaxHp: 100,
		});

		expect(entries).toEqual([
			{
				displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
				label: HUD_COPY.SNAPSHOT_LABELS.CURRENT_ROOM,
				value: "Entrance",
			},
			{
				displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
				label: HUD_COPY.SNAPSHOT_LABELS.ROOM_STATE,
				value: "entrance",
			},
			{
				displayVariant: HUD_DISPLAY_VARIANTS.BADGE,
				label: HUD_COPY.SNAPSHOT_LABELS.TREASURE_KEY,
				value: "Missing",
			},
			{
				displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
				label: HUD_COPY.SNAPSHOT_LABELS.ENEMIES_REMAINING,
				value: "1",
			},
			{
				displayVariant: HUD_DISPLAY_VARIANTS.TEXT,
				label: HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
				value: "80 / 100",
			},
		]);

		expect(getSidebarSnapshotEntries(entries)).toEqual([
			entries[0],
			entries[1],
			entries[2],
			entries[3],
		]);
	});

	it("builds hp view model with clamped percentage and low-health flag", () => {
		expect(buildHudHealthViewModel({ playerHp: 25, playerMaxHp: 100 })).toEqual(
			{
				fillClassName: "hp-bar-fill hp-bar-fill-low",
				hpPercentage: 25,
				isLowHp: true,
				label: "25 / 100",
			},
		);

		expect(
			buildHudHealthViewModel({ playerHp: 150, playerMaxHp: 100 }),
		).toEqual({
			fillClassName: "hp-bar-fill",
			hpPercentage: 100,
			isLowHp: false,
			label: "150 / 100",
		});
	});
});
