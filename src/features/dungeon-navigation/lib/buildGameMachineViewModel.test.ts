import { describe, expect, it, vi } from "vitest";

import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	ROOM_IDS,
} from "@/entities/dungeon";

import { NAVIGATION_ACTION_EVENTS } from "../config";
import { buildGameMachineActionButtons } from "./buildGameMachineActionButtons";
import { createGameMachineViewModel } from "./buildGameMachineViewModel";

const createViewModelInput = (overrides = {}) => ({
	activeStateLabel: ROOM_IDS.ENTRANCE,
	currentRoomId: ROOM_IDS.ENTRANCE,
	discoveredRooms: [ROOM_IDS.ENTRANCE],
	enemiesRemaining: 1,
	hasTreasureKey: false,
	nearInteractable: null,
	navigationActionContext: {
		currentRoomId: ROOM_IDS.ENTRANCE,
		enemiesRemaining: 1,
		hasTreasureKey: false,
		nearInteractable: null,
	},
	handleDungeonEventSend: vi.fn(),
	handleDungeonRunReset: vi.fn(),
	...overrides,
});

describe("createGameMachineViewModel", () => {
	it("builds action buttons from the navigation context", () => {
		const handleDungeonEventSend = vi.fn();

		const actionButtons = buildGameMachineActionButtons({
			handleDungeonEventSend,
			navigationActionContext: {
				currentRoomId: ROOM_IDS.ENTRANCE,
				enemiesRemaining: 1,
				hasTreasureKey: false,
				nearInteractable: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
			},
		});

		expect(actionButtons).toHaveLength(NAVIGATION_ACTION_EVENTS.length);
		expect(
			actionButtons.find(
				(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
			)?.label,
		).toBe("Enter Library");
	});

	it("groups room, status, and navigation values from the machine context", () => {
		const result = createGameMachineViewModel(createViewModelInput());

		expect(result.machine.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.room.currentRoomId).toBe(ROOM_IDS.ENTRANCE);
		expect(result.room.currentRoomLabel).toBe("Entrance");
		expect(result.room.discoveredRoomLabels).toEqual(["Entrance"]);
		expect(result.status.nearInteractableLabel).toBe("—");
		expect(result.navigation.actionButtons).toHaveLength(10);
	});

	it("derives action button labels, disabled state, and event triggers", () => {
		const handleDungeonEventSend = vi.fn();
		const result = createGameMachineViewModel(
			createViewModelInput({
				nearInteractable: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				navigationActionContext: {
					currentRoomId: ROOM_IDS.ENTRANCE,
					enemiesRemaining: 1,
					hasTreasureKey: false,
					nearInteractable: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				},
				handleDungeonEventSend,
			}),
		);

		const libraryAction = result.navigation.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);
		const guardRoomAction = result.navigation.actionButtons.find(
			(actionButton) =>
				actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		);

		expect(libraryAction?.label).toBe("Enter Library");
		expect(libraryAction?.isDisabled).toBe(false);
		libraryAction?.handleDungeonActionTrigger();
		expect(handleDungeonEventSend).toHaveBeenCalledWith(
			DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		expect(guardRoomAction?.label).toBe("Enter Guard Room");
		expect(guardRoomAction?.isDisabled).toBe(true);
	});

	it("passes through navigation reset handling", () => {
		const handleDungeonRunReset = vi.fn();

		const result = createGameMachineViewModel(
			createViewModelInput({
				handleDungeonRunReset,
			}),
		);

		result.navigation.handleDungeonRunReset();

		expect(handleDungeonRunReset).toHaveBeenCalledTimes(1);
	});

	it("derives the current room and nearby interaction labels", () => {
		const result = createGameMachineViewModel(
			createViewModelInput({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
				hasTreasureKey: true,
				nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
				navigationActionContext: {
					currentRoomId: ROOM_IDS.GUARD_ROOM,
					enemiesRemaining: 0,
					hasTreasureKey: true,
					nearInteractable: buildDoorKey(ROOM_IDS.GUARD_ROOM, DOOR_SIDES.SOUTH),
				},
			}),
		);

		expect(result.room.currentRoomLabel).toBe("Guard Room");
		expect(result.room.discoveredRoomLabels).toEqual(["Entrance", "Library"]);
		expect(result.status.nearInteractableLabel).toBe("Guard Room, South");
		expect(result.status.hasTreasureKey).toBe(true);
		expect(result.status.enemiesRemaining).toBe(1);
	});
});
